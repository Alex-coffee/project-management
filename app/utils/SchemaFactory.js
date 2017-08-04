var mongoose = require('mongoose');
var settings = rootRequire('config/settings');
let modelMap = {};

var init = function (connectionMap) {
    mongoose.connect(settings.dbURL);
    var db = mongoose.connection;
    
    var Demand = rootRequire('app/model/demand');
    var Item = rootRequire('app/model/item');
    var ItemBOM = rootRequire('app/model/itemBOM');
    var KPI = rootRequire('app/model/kpi');
    var Line = rootRequire('app/model/line');
    var Production = rootRequire('app/model/production');
    var ProductionPlan = rootRequire('app/model/productionPlan');
    var Scenario = rootRequire('app/model/scenario');
    var UncoveredDemand = rootRequire('app/model/uncoveredDemand');

    modelMap["connection"] = mongoose.connection;
    modelMap["demand"] = Demand;
    modelMap["item"] = Item;
    modelMap["itembom"] = ItemBOM;
    modelMap["kpi"] = KPI;
    modelMap["line"] = Line;
    modelMap["production"] = Production;
    modelMap["productionplan"] = ProductionPlan;
    modelMap["scenario"] = Scenario;
    modelMap["uncovereddemand"] = UncoveredDemand;
}

var getModel = function (name) {
    return modelMap[name]
}
var getSchema = function (name) {
    return modelMap[name].schema;
}

var getConnection = function () {
    modelMap["connection"];
}

module.exports = {
    init: init,
    getModel: getModel,
    getSchema: getSchema,
    getConnection: getConnection
};