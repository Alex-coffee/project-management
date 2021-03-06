var q = require('q');
var async = require('async');
var fs = require('fs');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var SchemaServices = rootRequire('app/services/SchemaServices');
var SchemaFactory = rootRequire('app/utils/SchemaFactory');
var settings = rootRequire('config/settings');
var path = require('path');

const ItemType = {"PRODUCT": "product", "MATERIAL": "material"};

const toCamelCase = function(str) {
    return str
        .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
}

function getDateArrayByRange(startDate, endDate){
    if(startDate && endDate && startDate.getTime() <= endDate.getTime()){
    let result = [];
    var dateIntevalTime = startDate.getTime()
    while(dateIntevalTime <= endDate.getTime()){
        result.push(new Date(dateIntevalTime));
        dateIntevalTime += 24 * 3600 * 1000;
    }
    return result;
  }else
    return undefined;
}

function getDayInDateArray(dateRangeArray, day){
    let arrayTemp = []
    if(dateRangeArray){
        dateRangeArray.forEach(d => {
            arrayTemp.push(d.getTime());
        });
    }
    return arrayTemp.indexOf(day.getTime());
}

function getMinutesFromString(minStr){
    var hour = parseInt(minStr.split(":")[0]);
    var minutes = parseInt(minStr.split(":")[1]);
    return hour * 60 + minutes;
}

function writeFile(scenarioId, fileName, content){
    try{
        let inputPath = path.join(settings.systemPath, 'temp', scenarioId);
        if (!fs.existsSync(inputPath)){
            fs.mkdirSync(inputPath);
        }
        let fd = fs.openSync(path.join(inputPath, fileName), "w");
        var points = JSON.stringify(content);
        var buf = new Buffer(points);
        fs.writeSync(fd,buf,0,buf.length,0);
    }catch(e){
        console.log(e);
    }
}

function saveORInput(scenarioId){
    var deferred = q.defer();
    const inputPath = path.join(settings.systemPath, 'temp', scenarioId);
    if (!fs.existsSync(inputPath)){
        fs.mkdirSync(inputPath);
    }
    let inputFiles = fs.readdirSync(inputPath);
    let ORInput = {scenario: scenarioId};

    inputFiles.forEach(file => {
        let content = fs.readFileSync(path.join(inputPath, file));
        let keyName = file.substring(0, file.indexOf("."));
        if(keyName != ""){
            ORInput[keyName] = JSON.parse(content.toString());
        }
    })

    let ORInputModel = SchemaFactory.getModel("orinput");
    SchemaServices.save(ORInputModel, ORInput).then(result => {
        deferred.resolve(result);
    }, err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

function saveORResult(scenarioId){
    var deferred = q.defer();
    const outputPath = path.join(settings.systemPath, 'output', scenarioId);
    if (!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath);
    }
    let outputFiles = fs.readdirSync(outputPath);
    let ORResult = {scenario: scenarioId};

    outputFiles.forEach(file => {
        let content = fs.readFileSync(path.join(outputPath, file));
        let keyName = file.substring(0, file.indexOf("."));
        if(keyName != ""){
            ORResult[keyName] = JSON.parse(content.toString());
        }
    })

    let ORResultModel = SchemaFactory.getModel("orresult");
    SchemaServices.save(ORResultModel, ORResult).then(result => {
        deferred.resolve(result);
    }, err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

var apiInit = function(app){

    app.post('/api/or/run', function(req, res) {
        let scenarioId = req.body.id;
        let company = req.body.company;

        async.waterfall([
            //process OrderRawMaterials
            function(callback){
                let itemBOM = SchemaFactory.getModel("itembom");
                SchemaServices.find(itemBOM, {"company": company, "isDeleted": false}, {"populateFields": "item materials.item"}).then(res => {
                    let itemBOMList = res;
                    let orderRawMaterials = [];
                    itemBOMList.forEach(itemBOM => {
                        let raws = [];
                        itemBOM.materials.forEach(m => {
                            raws.push({
                                rawName: m.item.name,
                                amount: m.amount
                            })
                        })
                        orderRawMaterials.push({
                            orderName: itemBOM.item.name,
                            raws: raws
                        })
                    })                    
                    writeFile(scenarioId, "OrderRawMaterials.json", orderRawMaterials);
                    callback(null, orderRawMaterials.length);
                });
            },
            
            //process Parameters
            function(arg1, callback){
                let scenario = SchemaFactory.getModel("scenario");
                SchemaServices.findById(scenario, scenarioId).then(scenario => {
                    let scenarioNumDays = 0;
                    var dateRangeArray = getDateArrayByRange(new Date(scenario.startDate), new Date(scenario.endDate));
                    if(dateRangeArray) scenarioNumDays = dateRangeArray.length;

                    let parameters = {};
                    parameters =  {
                        "numDays": scenarioNumDays,
                        "penaltyForLineModeChange": scenario.penaltyForLineModeChange,
                        "isPenalizeForNumLineModeChangeOn": scenario.isPenalizeForNumLineModeChangeOn,
                        "isPenalizeForStorageOn": scenario.isPenalizeForStorageOn,
                        "penaltyForLineUsage": scenario.penaltyForLineUsage,
                        "isPenalizeForNumLineUsedOn": scenario.isPenalizeForNumLineUsedOn,
                        "isRawMaterialPrepareConstraintOn": scenario.isRawMaterialPrepareConstraintOn,
                        "isSafeStorageHardConstraint": scenario.isSafeStorageHardConstraint,
                        "penaltyForUseSafeStorage": scenario.penaltyForUseSafeStorage,
                        "safeStorageCalculateMethod": scenario.safeStorageCalculateMethod,
                        'maxNumModeChangesDaily': scenario.maxNumModeChangesDaily
                    }

                    writeFile(scenarioId, "Parameters.json", parameters);
                    callback(null, scenarioNumDays, dateRangeArray, scenario);
                });
            },
            //process ProductStaticData
            function(scenarioNumDays, dateRangeArray, scenario, callback){
                let productStatic = SchemaFactory.getModel("productstatic");
                SchemaServices.find(productStatic, {
                    scenario: scenarioId,
                }, {"populateFields": "product"})
                .then(res => {
                    let productStaticList = res;
                    let productStaticData = [];

                    productStaticList.forEach(ps => {
                        let avaiLines = [];
                        avaiLines.push(ps.mainLine);
                        if(ps.subLine) avaiLines.push(ps.subLine);

                        productStaticData.push({
                            orderName: ps.product.name,
                            mainLine: ps.mainLine,
                            subLine: ps.subLine ? ps.subLine : "-1",
                            avaiLines: avaiLines,
                            unitTime: ps.unitTime
                        })
                    });

                    writeFile(scenarioId, "ProductStaticData.json", productStaticData);
                    callback(null, scenarioNumDays, dateRangeArray, scenario);
                });
            },
            //process Orders
            function(numDays, dateRangeArray, scenario, callback){
                let OrderDemand = SchemaFactory.getModel("orderdemand");
                let Item = SchemaFactory.getModel("item");

                q.all([
                    SchemaServices.find(Item, {"type": ItemType.PRODUCT, "company": company}, {}),
                    SchemaServices.find(OrderDemand, {
                        scenario: scenarioId,
                        date: {
                            $gte: scenario.startDate,
                            $lt: scenario.endDate
                        }
                    }, {})
                ]).then(resArray => {
                    let productList = resArray[0];
                    let orderDemands = resArray[1];

                    let ordersData = [];
                    productList.forEach(product => {
                        let demands = [];
                        let currentProductDemands = orderDemands.filter(od => {
                            return od.item.toString() == product._id.toString() && od.isDeleted == false;
                        });
                        dateRangeArray.forEach(sdate => {
                            let pd = currentProductDemands.find(d => {
                                return new Date(d.date).getTime() == new Date(sdate).getTime();
                            });
                            if(pd){
                                demands.push(pd.amount);
                            }else{
                                demands.push(0);
                            }
                        })

                        ordersData.push({
                            "orderId": product._id.toString(),
                            "orderName": product.name,
                            "unitCost": product.cost,
                            "safeStorage": product.saftyStorage,
                            "initialStorage": product.initialStorage,
                            "storageCost": product.storageCost,
                            "advAmount": product.advAmount,
                            "priority": product.priority,
                            "minProductAmount": product.minProductAmount,
                            "demands" : demands
                        })
                    });

                    writeFile(scenarioId, "Orders.json", ordersData);
                    callback(null, numDays, dateRangeArray, scenario);
                }) 
            },
            //process RawMaterials
            function(numDays, dateRangeArray, scenario, callback){
                let PurchasePlan = SchemaFactory.getModel("purchaseplan");
                let Item = SchemaFactory.getModel("item");

                q.all([
                    SchemaServices.find(Item, {"type": ItemType.MATERIAL, "company": company}, {"populateFields": "refItem"}),
                    SchemaServices.find(PurchasePlan, {
                        scenario: scenarioId,
                        date: {
                            $gte: scenario.startDate,
                            $lt: scenario.endDate
                        }
                    }, {})
                ]).then(resArray => {
                    let materialList = resArray[0];
                    let purchasePlans = resArray[1];

                    let rawMaterialData = [];
                    let rawOrderData = [];

                    materialList.forEach(material => {
                        let supplys = [];
                        let currentMaterialPlan = purchasePlans.filter(pp => {
                            return pp.item.toString() == material._id.toString() && pp.isDeleted == false;
                        });
                        dateRangeArray.forEach(sdate => {
                            let pd = currentMaterialPlan.find(d => {
                                return new Date(d.date).getTime() == new Date(sdate).getTime();
                            });
                            if(pd){
                                supplys.push(pd.amount);
                            }else{
                                supplys.push(0);
                            }
                        })

                        if(material.useItem && material.refItem){
                            rawOrderData.push({
                                "orderName": material.refItem.name,
                                "rawName": material.name
                            })
                        }

                        rawMaterialData.push({
                            "rawId": material._id.toString(),
                            "rawName": material.name,
                            "unitCost": material.cost,
                            "safeStorage": material.safeStorage,
                            "initialStorage": material.initialStorage,
                            "advAmount": material.advAmount,
                            "storageCost": material.storageCost,
                            "supplys" : supplys
                        });
                    });

                    writeFile(scenarioId, "RawMaterials.json", rawMaterialData);
                    writeFile(scenarioId, "RawOrderMap.json", rawOrderData);
                    callback(null, numDays, dateRangeArray, scenario);
                }) 
            },
            //process LineStaticData
            function(numDays, dateRangeArray, scenario, callback){
                let line = SchemaFactory.getModel("line");
                SchemaServices.find(line, {"company": company}, {}).then(result => {
                    let lines = result;
                    let lineStaticData = [];
                    lines.forEach(line => {
                        //TODO process lineCloseSchedule
                        const lineCloseSchedule = [];
                        const lcsArray = line.lineCloseSchedule;
                        if(lcsArray && lcsArray.length > 0){
                            lcsArray.forEach(lcs => {
                                lineCloseSchedule.push({
                                    dayInt: getDayInDateArray(dateRangeArray, new Date(lcs.day)),
                                    intervalStart: getMinutesFromString(lcs.intervalStart),
                                    intervalEnd: getMinutesFromString(lcs.intervalEnd)
                                });
                            });
                        }

                        lineStaticData.push({
                            "availHours": line.availableHours * numDays,
                            "lineId": line._id.toString(), 
                            "name": line.name, 
                            "turnHours": line.turnHours,
                            "lineCloseSchedule": lineCloseSchedule
                        })
                    })
                    writeFile(scenarioId, "LineStaticData.json", lineStaticData);
                    callback(null, numDays, dateRangeArray, scenario);
                }, err => {
                    callback(null, 500);
                });
            },
             //process LockedSchedule
             function(numDays, dateRangeArray, scenario, callback){
                let productionPlan = SchemaFactory.getModel("productionplan");
                SchemaServices.find(productionPlan, 
                        {
                            "scenario": scenarioId, 
                            date: {
                                $gte: scenario.startDate,
                                $lt: scenario.endDate
                            }},
                        {"populateFields": "item line"}
                    ).then(result => {
                    let productionPlans = result;
                    let LockedScheduleData = [];

                    productionPlans.forEach(pp => {
                        if(dateRangeArray.findIndex(dr => new Date(pp.date).getTime() == new Date(dr).getTime()) > -1 
                            && pp.isLocked){
                            LockedScheduleData.push({
                                "orderId": pp.item._id.toString(),
                                "orderName": pp.item.name, 
                                "amount":  pp.amount, 
                                "line":  pp.line._id.toString(),
                                "time": dateRangeArray.findIndex(dr => new Date(pp.date).getTime() == new Date(dr).getTime())
                            })
                        }
                    })
                    writeFile(scenarioId, "LockedSchedule.json", LockedScheduleData);
                    callback(null, numDays);
                }, err => {
                    callback(null, 500);
                });
            },
            //clear current result
            function(numDays, callback){
                let orResultModel = SchemaFactory.getModel("orresult");
                SchemaServices.removeByCondition(orResultModel, {"scenario": scenarioId}).then(result => {
                    callback(null, result);
                }, err => {
                    callback(null, 500);
                });
            },
            //clear input 
            function(numDays, callback){
                let orInputModel = SchemaFactory.getModel("orinput");
                SchemaServices.removeByCondition(orInputModel, {"scenario": scenarioId}).then(result => {
                    callback(null, result);
                }, err => {
                    callback(null, 500);
                });
            },
            // run OR
            function(numDays, callback){
                const outputPath = path.join(settings.systemPath, 'output', scenarioId);
                if (!fs.existsSync(outputPath)){
                    fs.mkdirSync(outputPath);
                }
                var orCommand = [];
                orCommand.push(settings.systemPath + settings.command);
                orCommand.push(path.join(settings.systemPath, 'temp', scenarioId) + "/");
                orCommand.push(outputPath + "/");
                orCommand.push("optimize");
                console.log("command: " + orCommand.join(" "));

                var bat = spawn('cmd', ['/c', orCommand.join(" ")],{
                    cwd: settings.systemPath
                });

                bat.stdout.on('data', function (data) {
                    console.log(data.toString());
                });
        
                bat.stderr.on('error', function (data) {
                    console.log(data.toString());
                });
        
                bat.on('exit', function (code) {
                    console.log("Code: " + code);
                    if(code == 0){
                        callback(null, 200);
                    }else{
                        callback(500, code);
                    }
                });
            },

            function(orResultCode, callback){
                q.all([
                    saveORInput(scenarioId),
                    saveORResult(scenarioId)
                ]).then(result => {
                    callback(null, result);
                }, err => {
                    callback(500, "save result failed");
                })
            }
        ],
        function(err, results) {
            if(err){
                res.status(500).send({message: "运行失败, code: " + err});
            }else{
                res.status(200).send({
                    message: "已生成结果"
                });
            }
        });
    });

}

module.exports = {
    apiInit: apiInit
};