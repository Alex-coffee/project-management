var q = require('q');

String.prototype.startWith=function(str){
    var reg=new RegExp("^"+str);
    return reg.test(this);
}

String.prototype.endWith=function(str){
    var reg=new RegExp(str+"$");
    return reg.test(this);
}

var count = function(schema, conditions){
    var deferred = q.defer();
    var query;
    if(typeof conditions == "string" && conditions.startWith("{") && conditions.endWith("}")){
        query = schema.find(JSON.parse(conditions));
    }else{
        query = schema.find(conditions);
    }

    query.count().exec(function(err, result) {
        if (!err){
            deferred.resolve(result);
        } else {throw err;}
    })
    return deferred.promise;
}

var find = function(schema, conditions, options){
    var deferred = q.defer();
    var query;
    if(typeof conditions == "string" && conditions.startWith("{") && conditions.endWith("}")){
        query = schema.find(JSON.parse(conditions));
    }else{
        query = schema.find(conditions);
    }

    if(options == undefined) options = {};

    if(options.selectFields){
        query = query.select(options.selectFields);
    }
    if(options.populateFields){
        query = query.populate(options.populateFields);
    }

    if(options.sortFields){
        query = query.sort(JSON.parse(options.sortFields));
    }
    if(options.currentPage != undefined && options.pageSize != undefined){
        let currentPage = parseInt(options.currentPage);
        let pageSize = parseInt(options.pageSize);
        query = query.skip((currentPage - 1) * pageSize).limit(pageSize);
    }

    query.exec(function(err, result) {
        if (!err){
            deferred.resolve(result);
        } else {throw err;}
    })
    return deferred.promise;
}

var findById = function(schema, id){
    var deferred = q.defer();
    schema.findById(id, function(err, result) {
        if (!err){
            deferred.resolve(result);
        } else {throw err;}
    });
    return deferred.promise;
}

var save = function(schema, data){
    var deferred = q.defer();

    schema.findById(data._id, function (err, todo) {
        // Handle any possible database errors
        if (err) {
            deferred.reject();
        } else {
            if(todo == undefined){
                todo = new schema(data);
            }else{
                for(let key in data){
                    if(data[key] == "undefined") data[key] = undefined;
                }
                Object.assign(todo, data);
            }

            // Save the updated document back to the database
            todo.save(function (err, todo) {
                if (err) {
                    console.log(err);
                    deferred.reject(err);
                }
                deferred.resolve(todo);
            });
        }
    });
    return deferred.promise;
}

var remove = function(schema, data){
    var deferred = q.defer();

    schema.findByIdAndRemove(data._id, function (err, ip) {
        if (err) {
            deferred.reject(err);
        }
        deferred.resolve(ip);
    });

    return deferred.promise;
}

var insertMany = function(schema, data){
    var deferred = q.defer();

    schema.insertMany(data, function (err, todo) {
        // Handle any possible database errors
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(todo);
        }
    });
    return deferred.promise;
}

var batchUpsert = function(schema, data, keys){
    var deferred = q.defer();

    var bulk = schema.collection.initializeUnorderedBulkOp();
    data.forEach(function (item) {
        var updateObj = {};
        keys.forEach(function (key) {
            updateObj[key] = item[key]
        })
        bulk.find({_id: item._id}).upsert().update({$set: updateObj});
    })

    bulk.execute(function(err, result) {
        if (!err){
            deferred.resolve(result);
        } else {throw err;}
    })
    return deferred.promise;
}

module.exports = {
    count: count,
    find: find,
    findById: findById,
    save: save,
    remove: remove,
    insertMany: insertMany,
    batchUpsert: batchUpsert
};