const q = require('q');
const SchemaServices = rootRequire('app/services/SchemaServices');
const SchemaFactory = rootRequire('app/utils/SchemaFactory');
const settings = rootRequire('config/settings');
const csv = require('csv-parser');

const fs = require('fs')
const path = require('path');
const async = require('async');
const orderDataFileName = "orderData.csv";
const productStaticFileName = "productStatic.csv";
const lineFileName = "lineData.csv";

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, settings.uploadPath);
    },
    limits: {
        fileSize: 200000000
    },
    filename: function (req, file, cb) {
        const timeStamp = new Date().getTime();
        cb(null, "scenarioImport_" + timeStamp + ".csv");
    }
})
const upload = multer({ storage: storage })

const productStaticStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, settings.uploadPath);
    },
    limits: {
        fileSize: 200000000
    },
    filename: function (req, file, cb) {
        //cb(null, file.originalname);
        cb(null, productStaticFileName);
    }
})
const productStaticUpload = multer({ storage: productStaticStorage })

const lineStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, settings.uploadPath);
    },
    limits: {
        fileSize: 200000000
    },
    filename: function (req, file, cb) {
        //cb(null, file.originalname);
        cb(null, lineFileName);
    }
})
const lineUpload = multer({ storage: lineStorage })

const isDateString = function(str){
    if(str.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)) { 
        return true;
    } else { 
        return false;
    } 
}

const generateOrderDemands = function(rawData, itemId, scenarioId, company){
    let orderDemands = [];
    for(let key in rawData){
        if(isDateString(key)){
            orderDemands.push({
                date: new Date(key),
                amount: parseInt(rawData[key]),
                item: itemId,
                scenario: scenarioId
            })
        }
    }
    return orderDemands;
}

const generateProductLineStatic = function(rawData, scenarioId, company){
    let defer = q.defer();
    let result = [];
    const item = SchemaFactory.getModel("item");
    const line = SchemaFactory.getModel("line");
    const productstatic = SchemaFactory.getModel("productstatic");

    q.all([
        SchemaServices.find(item, {company: company, type: 'product'}),
        SchemaServices.find(line, {company: company})
    ]).then(results => {
        let products = results[0];
        let lines = results[1];
        if (products.length > 0 && lines.length > 0) {
            const relProduct = products.find(p => p.name == rawData.orderName);
            const relLine = lines.find(l => l.name == rawData.mainLine);
            const subLine = lines.find(l => l.name == rawData.subLine);
            if(relProduct && relLine){
                let productStaticData = {
                    product: relProduct._id.toString(),
                    mainLine: relLine._id.toString(),
                    subLine: subLine ? subLine._id.toString() : undefined,
                    unitTime: parseInt(rawData.unitTime ? rawData.unitTime : 0),
                    scenario: scenarioId
                }

                SchemaServices.save(productstatic, productStaticData).then(ps => {
                    console.log(ps);
                })
            }  
        }
        defer.resolve(result);

    })
    return defer.promise;
}

const parseOrderData = function(scenarioId, res, company){
    let orderData = [];
    const itemModel = SchemaFactory.getModel("item");
    let counts = {
        productAdd: 0,
        productExists: 0,
        orderDemandsNum: 0,
    }

    try{
        fs.createReadStream(path.join(settings.uploadPath, orderDataFileName))
        .pipe(csv())
        .on('data', function (productRawData) {
          const product = {
              name: productRawData.orderName,
              desc: productRawData.desc,
              type: 'product',
              saftyStorage: productRawData.saftyStorage ? productRawData.saftyStorage : 0,
              initialStorage: productRawData.initStorage ? productRawData.initStorage : 0,
              advAmount: productRawData.advAmount ? productRawData.advAmount : 0,
              scenario: scenarioId,
          };
  
          async.waterfall([
              function(callback) {
                  SchemaServices.find(itemModel, {name: productRawData.orderName, scenario: scenarioId}).then(function(result){
                      if(result.length > 0){//if item exists get the id 
                          const order = result[0];
                          counts.productExists += 1;
                      }else{//create new item and return the id
                          SchemaServices.save(itemModel, product).then(function(newItem){
                              callback(null, newItem._id.toString());
                          });
                      }
                  });
              },
              function(itemId, callback) {
                  let orderDemands = generateOrderDemands(productRawData, itemId, scenarioId);
                  const orderDemand = SchemaFactory.getModel("orderdemand");
                  counts.orderDemandsNum = orderDemands.length;

                  SchemaServices.insertMany(orderDemand, orderDemands).then(result => {
                      callback(null, result);
                  })
              }
          ], function (err, result){
              if(err){
                console.log(err);
              }
          })
          
          orderData.push(productRawData);
        })
        .on('end', function (data) {
          res.status(200).send({"message" : "已生成优化结果"});
        })
    }catch(err){
        res.status(500).send(err);
    }
}

const parseProductLineData = function(scenarioId, res, company){
    
    try{
        fs.createReadStream(path.join(settings.uploadPath, productStaticFileName))
        .pipe(csv())
        .on('data', function (productStaticData) {
            generateProductLineStatic(productStaticData, scenarioId)
        })
        .on('end', function (data){
            res.status(200).send(data);
        })
    }catch(err){
        res.status(500).send(err);
    }
}

const parseLineData = function(scenarioId, res, company){
    let lineNames = [];
    
    try{
        fs.createReadStream(path.join(settings.uploadPath, lineFileName))
        .pipe(csv())
        .on('data', function (lineData) {
            if(lineNames.indexOf(lineData.mainLine) == -1 && lineData.mainLine !== ""){
                lineNames.push(lineData.mainLine);
            }
            if(lineData.subLine && lineNames.indexOf(lineData.subLine) == -1 && lineData.subLine !== ""){
                lineNames.push(lineData.subLine);
            }
        })
        .on('end', function (data){
            const lineModel = SchemaFactory.getModel("line");
            lineNames.forEach(line => {
                let lineData = {
                    name: line,
                    availableHours: 22,
                    turnHours: 2,
                    scenario: scenarioId
                };

                SchemaServices.save(lineModel, lineData).then(result => {
                    //console.log("insert " + result.length + " rows of line data");
                })
            });

            res.status(200).send(data);
        })
    }catch(err){
        res.status(500).send(err);
    }
}

function processCompanyData(req, res) {
    const itemModel = SchemaFactory.getModel("item");
    const lineModel = SchemaFactory.getModel("line");

    let mode = req.body.mode;
    const fileName = req.body.filename;
    const scenarioId = req.body.scenarioId;
    const company = req.body.company;

    mode = "ignore";

    let productData = [];
    let lineNames = [];
    let lineData = [];
    let counts = {
        productAdd: 0,
        productUpdated: 0,
    }

    try{
        async.waterfall([
            function(callback) {
                fs.createReadStream(path.join(settings.uploadPath, fileName))
                .pipe(csv())
                .on('data', function (productRawData) {
                    //orders
                    const product = {
                        name: productRawData.orderName,
                        desc: productRawData.desc,
                        type: 'product',
                        saftyStorage: productRawData.saftyStorage ? productRawData.saftyStorage : 0,
                        initialStorage: productRawData.initStorage ? productRawData.initStorage : 0,
                        advAmount: productRawData.advAmount ? productRawData.advAmount : 0,
                        company: company,
                    };
                    productData.push(product);

                    //lines
                    if(lineNames.indexOf(productRawData.mainLine) == -1 && productRawData.mainLine !== ""){
                        lineNames.push(productRawData.mainLine);
                    }
                    if(productRawData.subLine && lineNames.indexOf(productRawData.subLine) == -1 && productRawData.subLine !== ""){
                        lineNames.push(productRawData.subLine);
                    }
                })
                .on('end', function (data) {

                    lineNames.forEach(l => {
                        let line = {
                            name: l,
                            availableHours: 22,
                            turnHours: 2,
                            company: company,
                        };
                        lineData.push(line);
                    })

                    q.all([
                        SchemaServices.batchUpsert(itemModel, productData, 
                            ["name", "company"], ["desc", "saftyStorage", "type", "initialStorage", "advAmount"]),
                        SchemaServices.batchUpsert(lineModel, lineData, 
                                ["name", "company"], ["availableHours", "turnHours"])
                    ]).then(response => {
                        callback(null, response);
                    });
                })
            }
        ], function(err, results) {
            res.status(200).send(results);
        })            
    }catch(err){
        res.status(500).send(err);
    }
}

function processScenarioData(req, res) {
    const itemModel = SchemaFactory.getModel("item");
    const lineModel = SchemaFactory.getModel("line");
    const productstaticModel = SchemaFactory.getModel("productstatic");
    const orderdemandModel = SchemaFactory.getModel("orderdemand");

    let mode = req.body.mode;
    const fileName = req.body.filename;
    const scenarioId = req.body.scenarioId;
    const company = req.body.company;
    const scenario = req.body.scenario;

    mode = "ignore";

    let rawDataArray = [];
    let lineNames = [];
    let lineData = [];
    let counts = {
        productAdd: 0,
        productUpdated: 0,
    }

    try{
        async.waterfall([
            function(callback) {
                SchemaServices.removeByCondition(productstaticModel, {
                    scenario: scenarioId,
                    date: {
                        $gte: scenario.startDate,
                        $lt: scenario.endDate
                    }
                }).then(result => {
                    callback(null, result);
                });
            },
            function(arg1, callback) {
                SchemaServices.removeByCondition(orderdemandModel, {
                    scenario: scenarioId,
                    date: {
                        $gte: scenario.startDate,
                        $lt: scenario.endDate
                    }
                }).then(result => {
                    callback(null, result);
                });
            },
            function(arg1, callback) {
                fs.createReadStream(path.join(settings.uploadPath, fileName))
                .pipe(csv())
                .on('data', function (productRawData) {
                    //orders
                    const product = {
                        name: productRawData.orderName,
                        desc: productRawData.desc,
                        type: 'product',
                        saftyStorage: productRawData.saftyStorage ? productRawData.saftyStorage : 0,
                        initialStorage: productRawData.initStorage ? productRawData.initStorage : 0,
                        advAmount: productRawData.advAmount ? productRawData.advAmount : 0,
                        company: company,
                    };
                    productData.push(product);

                    //lines
                    if(lineNames.indexOf(productRawData.mainLine) == -1 && productRawData.mainLine !== ""){
                        lineNames.push(productRawData.mainLine);
                    }
                    if(productRawData.subLine && lineNames.indexOf(productRawData.subLine) == -1 && productRawData.subLine !== ""){
                        lineNames.push(productRawData.subLine);
                    }
                })
                .on('end', function (data) {

                    lineNames.forEach(l => {
                        let line = {
                            name: l,
                            availableHours: 22,
                            turnHours: 2,
                            company: company,
                        };
                        lineData.push(line);
                    })

                    q.all([
                        SchemaServices.batchUpsert(itemModel, productData, 
                            ["name", "company"], ["desc", "saftyStorage", "type", "initialStorage", "advAmount"]),
                        SchemaServices.batchUpsert(lineModel, lineData, 
                                ["name", "company"], ["availableHours", "turnHours"])
                    ]).then(response => {
                        callback(null, response);
                    });
                })
            },
            function(arg1, callback) {
                fs.createReadStream(path.join(settings.uploadPath, fileName))
                .pipe(csv())
                .on('data', function (productRawData) {
                    rawDataArray.push(productRawData);
                })
                .on('end', function (data) {

                    q.all([
                        SchemaServices.find(itemModel, {company: company, type: 'product'}),
                        SchemaServices.find(lineModel, {company: company})
                    ]).then(results => {
                        let products = results[0];
                        let lines = results[1];

                        if (products.length > 0 && lines.length > 0) {
                            const orderDemands = [];
                            const productStaticDataArray = []
                    
                            rawDataArray.forEach(rawData => {
                                const relProduct = products.find(p => p.name == rawData.orderName);
                                const relLine = lines.find(l => l.name == rawData.mainLine);
                                const subLine = lines.find(l => l.name == rawData.subLine);
                                if(relProduct && relLine){
                                    let productStaticData = {
                                        product: relProduct._id.toString(),
                                        mainLine: relLine._id.toString(),
                                        subLine: subLine ? subLine._id.toString() : undefined,
                                        unitTime: parseInt(rawData.unitTime ? rawData.unitTime : 0),
                                        scenario: scenarioId
                                    }
                                    productStaticDataArray.push(productStaticData);
                                }

                                for(let key in rawData){
                                    if(isDateString(key) && relProduct){
                                        orderDemands.push({
                                            date: new Date(key),
                                            amount: parseInt(rawData[key]),
                                            item: relProduct._id.toString(),
                                            scenario: scenarioId
                                        })
                                    }
                                } 
                            });

                            q.all([
                                SchemaServices.insertMany(orderdemandModel, orderDemands),
                                SchemaServices.insertMany(productstaticModel, productStaticDataArray)
                            ]).then(response => {
                                callback(null, response);
                            });
                        }
                    })
                })
            }
        ], function(err, results) {
            if(err){
                res.status(500).send(err);
            }else{
                res.status(200).send(results);
            }
        })            
    }catch(err){
        res.status(500).send(err);
    }
}

var apiInit = function(app){

    app.post('/import/data/order', upload.array('file', 20),function(req, res){
        if (req.files != undefined) {
            res.sendStatus(200);
        }
    });

    app.post('/import/data/company', upload.array('file', 20),function(req, res){
        if (req.files != undefined) {
            res.status(200).send(req.files);
        }
    });

    app.post('/import/data/scenario', upload.array('file', 20),function(req, res){
        if (req.files != undefined) {
            res.status(200).send(req.files);
        }
    });

    app.post('/api/data/result/generate', function(req, res) {
        const dateFormat = require('dateFormat');
        const iconv = require('iconv-lite');
        const json2csv = require('json2csv');

        const scenaro = req.body.scenario;
        const scenarioDates = req.body.scenarioDates;
        const dateRangeLength = scenarioDates.length;

        async.waterfall([
            function(callback) {
                const orResultModel = SchemaFactory.getModel("orresult");
                SchemaServices.find(orResultModel, {"scenario": scenaro._id}, {}).then(result => {
                    let productSchedule = []; 
                    if(result && result.length > 0){
                        productSchedule = result[0].ProductionScheduleResult;
                    }
                    callback(null, productSchedule);
                });
            },
            function(productSchedule, callback) {
                const lineModel = SchemaFactory.getModel("line");
                SchemaServices.find(lineModel, {"scenario": scenaro._id}, {}).then(lines => {
                    callback(null, lines, productSchedule);
                });
            },
            function(lines, productSchedule, callback) {
                let processedProductSchedule = [];

                lines.forEach(line => {
                    let lineProductSchedule = productSchedule.filter(ps => {
                        return ps.plan.findIndex(p => {
                            return p.line == line._id;
                        }) > -1;
                    })

                    if (lineProductSchedule && lineProductSchedule.length > 0){
                        lineProductSchedule.forEach(ps => {
                            let rowItem = {};
                            rowItem.line = line.name;
                            rowItem.order = ps.orderName;
                            
                            ps.plan.forEach(p => {
                                rowItem[scenarioDates[p.time]] = p.amount;
                            })
                            processedProductSchedule.push(rowItem);
                        })
                    }
                });

                let csvFields = ["line", "order"].concat(scenarioDates);
                let fieldNames = ["生产线", "产品编号"];
                scenarioDates.forEach(d => {
                    fieldNames.push(dateFormat(new Date(d).getTime(), 'yyyy-mm-dd'));
                })
        
                console.log(csvFields);
                console.log(fieldNames);
        
                let csv = json2csv({ 
                    data: processedProductSchedule, 
                    fields: csvFields, 
                    fieldNames: fieldNames 
                });
                
                let filePath = path.join(settings.systemPath, 'output', 'ORResult.csv');
                var newCsv = iconv.encode(csv, 'GBK');
                fs.writeFileSync(filePath, newCsv);

                callback(null, 'success');
            }
        ], function(err, results) {
            if (err) {
                res.status(500).send(err);
            }else{
                res.status(200).send({message: "success"});
            }
        });
    });

    app.get('/data/result/export', function(req, res) {
        res.download(path.join(settings.systemPath, 'output', 'ORResult.csv'), 'ORResult.csv');
    });

    app.post('/import/data/productstatic', productStaticUpload.array('file', 20),function(req, res){
        if (req.files != undefined) {
            res.sendStatus(200);
        }
    });
    
    app.post('/import/data/line', lineUpload.array('file', 20),function(req, res){
        if (req.files != undefined) {
            res.sendStatus(200);
        }
    });

    app.post('/api/data/orderprocess', function(req, res){
        const itemModel = SchemaFactory.getModel("item");
        const productstatic = SchemaFactory.getModel("productstatic");
        const orderdemand = SchemaFactory.getModel("orderdemand");
        async.parallel({
            clearItem: function(callback) {
                SchemaServices.removeByCondition(itemModel, {scenario: req.body.scenarioId,}).then(result => {
                    callback(null, result);
                });
            },
            clearProductStatic: function(callback) {
                SchemaServices.removeByCondition(productstatic, {scenario: req.body.scenarioId,}).then(result => {
                    callback(null, result);
                });
            },
            clearOrderDemand: function(callback) {
                SchemaServices.removeByCondition(orderdemand, {scenario: req.body.scenarioId,}).then(result => {
                    callback(null, result);
                });
            }
        }, function(err, results) {
            if (err) {
                res.status(500).send(err);
            }else{
                console.log(results)
                parseOrderData(req.body.scenarioId, res);
            }
        });
    });

    app.post('/api/data/productstatic', function(req, res){
        const productstatic = SchemaFactory.getModel("productstatic");
        SchemaServices.removeByCondition(productstatic, {scenario: req.body.scenarioId})
        .then(function(result){
            console.log("remove " + result.length + " rows of product static data");
            parseProductLineData(req.body.scenarioId, res);
        });
    });

    app.post('/api/data/lineprocess', function(req, res){
        const line = SchemaFactory.getModel("line");
        SchemaServices.removeByCondition(line, {scenario: req.body.scenarioId})
        .then(function(result){
            parseLineData(req.body.scenarioId, res);
        });
    });

    app.post('/api/data/scenario/process', function(req, res){
        processScenarioData(req, res);
    });

    app.post('/api/data/company/process', function(req, res){
        processCompanyData(req, res);
    });
}

module.exports = {
    apiInit: apiInit
};