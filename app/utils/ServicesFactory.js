var q = require('q');
var SchemaServices = rootRequire('app/services/SchemaServices');
var SchemaFactory = rootRequire('app/utils/SchemaFactory');

var apiInit = function(app){

    app.get('/api/find/model', function(req, res) {
        let promiseArray = [];
        let name = req.query.model;
        if(name) name = name.toLowerCase();
        let model = SchemaFactory.getModel(name);
        if(model){
            var queryOptions = {}
            if(req.query.options) queryOptions = JSON.parse(req.query.options);
            promiseArray.push(SchemaServices.count(model, req.query.conditions));
            promiseArray.push(SchemaServices.find(model, req.query.conditions, queryOptions));
        }else{
            // res.reject({message: "service not found"})
            res.status(500).send({message: "service not found"});
        }

        if(promiseArray.length > 0){
            q.all(promiseArray).then(function(result){
                res.json({
                    count: result[0],
                    list: result[1]
                });
            });
        }else{
            res.reject({message: "schema type error"})
        }
    });

    app.get('/api/find/id/model', function(req, res) {
        let promiseArray = [];
        let name = req.query.model;
        if(name) name = name.toLowerCase();
        let model = SchemaFactory.getModel(name);
        if(model){
            SchemaServices.findById(model, req.query.id).then(function(result){
                res.status(200).send(result);
            });
        }else{
            // res.reject({message: "service not found"})
            res.status(500).send({message: "service not found"});
        }
    });

    app.post('/api/save/model', function(req, res) {
        let name = req.body.model;
        if(name) name = name.toLowerCase();
        let model = SchemaFactory.getModel(name);
        if(model){
            SchemaServices.save(model, req.body.content).then(function(result){
                res.status(200).send(result);
            });
        }else{
            res.status(500).send({message: "service not found"});
        }
    });

    app.post('/api/batch/insert/model', function(req, res) {
        let name = req.body.model;
        if(name) name = name.toLowerCase();
        let model = SchemaFactory.getModel(name);
        if(model){
            SchemaServices.insertMany(model, req.body.content).then(function(result){
                res.status(200).send(result);
            });
        }else{
            res.status(500).send({message: "service not found"});
        }
    });

    app.post('/api/delete/model', function(req, res) {
        let name = req.body.model;
        if(name) name = name.toLowerCase();
        let model = SchemaFactory.getModel(name);
        if(model){
            SchemaServices.remove(model, req.body.content).then(function(result){
                res.status(200).send(result);
            });
        }else{
            res.status(500).send({message: "service not found"});
        }
    });

    app.post('/api/delete/model/condition', function(req, res) {
        let name = req.body.model;
        if(name) name = name.toLowerCase();
        let model = SchemaFactory.getModel(name);
        if(model){
            SchemaServices.removeByCondition(model, req.body.condition).then(function(result){
                res.status(200).send({"result": "success"});
            });
        }else{
            res.status(500).send({message: "service not found"});
        }
    });
}

module.exports = {
    apiInit: apiInit
};