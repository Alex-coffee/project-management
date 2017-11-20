var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ORResultSchema = new Schema({
    generalKPIs: {type: Object},
    LineKPIs: {type: Object},
    ProductionScheduleResult: {type: Object},
    RawMaterialDemandsResult: {type: Object},
    StorageAmountResult: {type: Object},
    storageKPIs: {type: Object},
    UncoveredDemands: {type: Object},
    DemandsCoveredBySafeStorage: {type: Object},
    scenario: { type: Schema.Types.ObjectId, ref: 'Scenario'},

    isDeleted: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

ORResultSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var ORResult = mongoose.model('ORResult', ORResultSchema);

module.exports = ORResult;