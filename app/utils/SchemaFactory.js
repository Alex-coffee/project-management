var mongoose = require('mongoose');
var settings = rootRequire('config/settings');
let modelMap = {};

var init = function (connectionMap) {
    mongoose.connect(settings.dbURL);
    var db = mongoose.connection;
    var Scenario = rootRequire('app/model/scenario');
    // var BusSchema = rootRequire('app/schema/bus');
    // var BusScheduleSchema = rootRequire('app/schema/busSchedule');
    // var CrewSchema = rootRequire('app/schema/crew');
    // var CrewPairingSchema = rootRequire('app/schema/crewPairing');

    modelMap["connection"] = mongoose.connection;
    modelMap["Scenario"] = Scenario;
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