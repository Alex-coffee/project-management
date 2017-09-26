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

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, settings.uploadPath);
    },
    limits: {
        fileSize: 200000000
    },
    filename: function (req, file, cb) {
        //cb(null, file.originalname);
        cb(null, orderDataFileName);
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

const isDateString = function(str){
    if(str.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)) { 
        return true;
    } else { 
        return false;
    } 
}

const generateOrderDemands = function(rawData, itemId, scenarioId){
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

const generateProductLineStatic = function(rawData, scenarioId){
    let defer = q.defer();
    let result = [];
    const item = SchemaFactory.getModel("item");
    const line = SchemaFactory.getModel("line");
    const productstatic = SchemaFactory.getModel("productstatic");

    q.all([
        SchemaServices.find(item, {scenario: scenarioId, type: 'product'}),
        SchemaServices.find(line, {scenario: scenarioId})
    ]).then(results => {
        let products = results[0];
        let lines = results[1];
        if (products.length > 0 && lines.length > 0) {
            const relProduct = products.find(p => p.name == rawData.orderName);
            const relLine = lines.find(l => l.name == rawData.mainLine);
            if(relProduct && relLine){
                let productStaticData = {
                    product: relProduct._id.toString(),
                    mainLine: relLine._id.toString(),
                    subLine: undefined,
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

const parseOrderData = function(scenarioId, res){
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
              scenario: scenarioId,
          };
  
          async.waterfall([
              function(callback) {
                  SchemaServices.find(itemModel, {name: productRawData.orderName}).then(function(result){
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

const parseProductLineData = function(scenarioId, res){
    
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

var apiInit = function(app){

    app.post('/api/data/order/import', upload.array('file', 20),function(req, res){
        if (req.files != undefined) {
            res.sendStatus(200);
        }
    });

    app.post('/api/data/productstatic/import', productStaticUpload.array('file', 20),function(req, res){
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
                SchemaServices.removeByCondition(itemModel, {scenario: req.body.scenarioId,}).then(res => {
                    callback(null, res);
                });
            },
            clearProductStatic: function(callback) {
                SchemaServices.removeByCondition(productstatic, {scenario: req.body.scenarioId,}).then(res => {
                    callback(null, res);
                });
            },
            clearOrderDemand: function(callback) {
                SchemaServices.removeByCondition(orderdemand, {scenario: req.body.scenarioId,}).then(res => {
                    callback(null, res);
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
}

module.exports = {
    apiInit: apiInit
};