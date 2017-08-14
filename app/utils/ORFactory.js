var q = require('q');
var async = require('async');
var fs = require('fs');
var SchemaServices = rootRequire('app/services/SchemaServices');
var SchemaFactory = rootRequire('app/utils/SchemaFactory');
var settings = rootRequire('config/settings');

const ItemType = {"PRODUCT": "product", "MATERIAL": "material"};

function getDateArrayByRange(startDate, endDate){
    if(startDate && endDate && startDate.getTime() <= endDate.getTime()){
    let result = [];
    var dateIntevalTime = startDate.getTime()
    while(dateIntevalTime < endDate.getTime()){
        result.push(new Date(dateIntevalTime));
        dateIntevalTime += 24 * 3600 * 1000;
    }
    return result;
  }else
    return undefined;
}

function writeFile(fileName, content){
    try{
        if (!fs.existsSync(settings.orInputPath)){
            fs.mkdirSync(settings.orInputPath);
        }
        let fd = fs.openSync(settings.orInputPath + fileName, "w");
        var points = JSON.stringify(content);
        var buf = new Buffer(points);
        fs.writeSync(fd,buf,0,buf.length,0);
    }catch(e){
        console.log(e);
    }
}

var apiInit = function(app){

    app.post('/api/or/run', function(req, res) {
        let scenarioId = req.body.id;
        async.waterfall([
            //process OrderRawMaterials
            function(callback){
                let itemBOM = SchemaFactory.getModel("itembom");
                SchemaServices.find(itemBOM, {"scenario": scenarioId, "isDeleted": false}, {}).then(res => {
                    let itemBOMList = res;
                    let orderRawMaterials = [];
                    itemBOMList.forEach(itemBOM => {
                        let raws = [];
                        itemBOM.materials.forEach(m => {
                            raws.push({
                                rawName: m.item,
                                amount: m.amount
                            })
                        })
                        orderRawMaterials.push({
                            orderName: itemBOM.item,
                            raws: raws
                        })
                    })                    
                    writeFile("OrderRawMaterials.json", orderRawMaterials);
                    callback(null, orderRawMaterials.length);
                });
            },
            //process ProductStaticData
            function(arg1, callback){
                let productStatic = SchemaFactory.getModel("productstatic");
                SchemaServices.find(productStatic, {"scenario": scenarioId, "isDeleted": false}, {}).then(res => {
                    let productStaticList = res;
                    let productStaticData = [];
                    productStaticList.forEach(ps => {
                        productStaticData.push({
                            orderName: ps.product,
                            mainLine: ps.mainLine,
                            subLine: ps.subLine ? ps.subLine : -1,
                            unitTime: ps.unitTime
                        })
                    });

                    writeFile("ProductStaticData.json", productStaticData);
                    callback(null, productStaticData.length);
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
                        "isRawMaterialPrepareConstraintOn": scenario.isRawMaterialPrepareConstraintOn
                    }

                    writeFile("Parameters.json", parameters);
                    callback(null, scenarioNumDays, dateRangeArray);
                });
            },
            //process Orders
            function(numDays, dateRangeArray, callback){
                let OrderDemand = SchemaFactory.getModel("orderdemand");
                let Item = SchemaFactory.getModel("item");

                q.all([
                    SchemaServices.find(Item, {"type": ItemType.PRODUCT, "scenario": scenarioId, "isDeleted": false}, {}),
                    SchemaServices.find(OrderDemand, {"scenario": scenarioId, "isDeleted": false}, {})
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
                            "orderId": product._id,
                            "orderName": product.name,
                            "unitCost": product.cost,
                            "safeStorage": product.safeStorage,
                            "initialStorage": product.initialStorage,
                            "storageCost": product.storageCost,
                            "demands" : demands
                        })
                    });

                    writeFile("Orders.json", ordersData);
                    callback(null, numDays, dateRangeArray);
                }) 
            },
            //process RawMaterials
            function(numDays, dateRangeArray, callback){
                let PurchasePlan = SchemaFactory.getModel("purchaseplan");
                let Item = SchemaFactory.getModel("item");

                q.all([
                    SchemaServices.find(Item, {"type": ItemType.MATERIAL, "scenario": scenarioId, "isDeleted": false}, {}),
                    SchemaServices.find(PurchasePlan, {"scenario": scenarioId, "isDeleted": false}, {})
                ]).then(resArray => {
                    let materialList = resArray[0];
                    let purchasePlans = resArray[1];

                    let rawMaterialData = [];
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

                        rawMaterialData.push({
                            "rawId": material._id,
                            "rawName": material.name,
                            "unitCost": material.cost,
                            "safeStorage": material.safeStorage,
                            "initialStorage": material.initialStorage,
                            "storageCost": material.storageCost,
                            "supplys" : supplys
                        });
                    });

                    writeFile("RawMaterials.json", rawMaterialData);
                    callback(null, numDays);
                }) 
            },
            //process LineStaticData
            function(numDays, callback){
                let line = SchemaFactory.getModel("line");
                SchemaServices.find(line, {"scenario": scenarioId, "isDeleted": false}, {}).then(res => {
                    let lines = res;
                    let lineStaticData = [];
                    lines.forEach(line => {
                        lineStaticData.push({
                            "availHours": line.availableHours * numDays,
                            "lineId": line._id, 
                            "turnHours": line.turnHours
                        })
                    })
                    writeFile("LineStaticData.json", lineStaticData);
                    callback(null, numDays);
                }, err => {
                    callback(null, 500);
                });
            }

            
        ],
        function(err, results) {
            console.log(results);
            res.status(200).send({
                message: "已生成结果"
            });
        });
    });

}

module.exports = {
    apiInit: apiInit
};