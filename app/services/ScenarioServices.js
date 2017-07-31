var q = require('q');
var SchemaServices = rootRequire('app/services/SchemaServices');
var SchemaFactory = rootRequire('app/utils/SchemaFactory');

var count = function(conditions){
    var Scenario = SchemaFactory.getModel("Scenario");
    return SchemaServices.count(Scenario, conditions);
}

var findAll = function(){
    var Scenario = SchemaFactory.getModel("Scenario");
    return SchemaServices.find(Scenario, {});
}

var find = function(conditions, selectedFields, sortFields, populateFields, currentPage, pageSize){
    var Scenario = SchemaFactory.getModel("Scenario");
    return SchemaServices.find(Scenario, conditions, {
        selectFields: selectedFields,
        sortFields: sortFields,
        populateFields: populateFields,
        currentPage: currentPage,
        pageSize: pageSize
    });
}

var findById = function(id){
    var Scenario = SchemaFactory.getModel("Scenario");
    var deferred = q.defer();
    Scenario.findById(id, function(err, result) {
        if (!err){
            deferred.resolve(result);
        } else {throw err;}
    });
    return deferred.promise;
}


var save = function(content){
    var Scenario = SchemaFactory.getModel("Scenario");
    return SchemaServices.save(Scenario, content);
}

var remove = function(content){
    var Scenario = SchemaFactory.getModel("Scenario");
    return SchemaServices.remove(Scenario, content);
}

module.exports = {
    count: count,
    findAll: findAll,
    find: find,
    findById: findById,
    save: save,
    remove: remove
};