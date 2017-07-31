var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ScenarioSchema = new Schema({
    description: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    penaltyForLineModeChange: {type: Number},
    isPenalizeForNumLineModeChangeOn: {type: Boolean, default: false},
    isPenalizeForStorageOn: {type: Boolean, default: false},
    penaltyForLineUsage: {type: Number},
    isPenalizeForNumLineUsedOn: {type: Boolean, default: false},
    isRawMaterialPrepareConstraintOn: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

ScenarioSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var Scenario = mongoose.model('Scenario', ScenarioSchema);

module.exports = Scenario;