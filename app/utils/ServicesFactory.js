var q = require('q');
let servicesMap = {};
var ScenarioServices = rootRequire('app/services/ScenarioServices');

servicesMap["scenario"] = ScenarioServices;

var getService = function (name) {
    return servicesMap[name];
}

var apiInit = function(app){

    app.get('/api/find/model', function(req, res) {
        let promiseArray = [];
        let name = req.query.model;
        if(name) name = name.toLowerCase();
        let service = getService(name);
        if(service){
            promiseArray.push(service.count(req.query.conditions));
            promiseArray.push(service.find(req.query.conditions, req.query.selectedFields, req.query.sortFields, req.query.populateFields,
                req.query.currentPage, req.query.pageSize));
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


    app.post('/api/save/model', function(req, res) {
        let name = req.body.model;
        if(name) name = name.toLowerCase();
        let service = getService(name);
        if(service){
            service.save(req.body.content).then(function(result){
                res.status(200).send(result);
            });
        }else{
            res.status(500).send({message: "service not found"});
        }
    });

    app.post('/api/delete/model', function(req, res) {
        let name = req.body.model;
        if(name) name = name.toLowerCase();
        let service = getService(name);
        if(service){
            service.remove(req.body.content).then(function(result){
                res.status(200).send(result);
            });
        }else{
            res.status(500).send({message: "service not found"});
        }
    });
}

module.exports = {
    getService: getService,
    apiInit: apiInit
};