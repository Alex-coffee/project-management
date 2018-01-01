var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ScenarioSchema = new Schema({
    description: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    penaltyForLineModeChange: {type: Number, default: 0},
    isPenalizeForNumLineModeChangeOn: {type: Boolean, default: false},
    isPenalizeForStorageOn: {type: Boolean, default: false},
    penaltyForLineUsage: {type: Number, default: 0},
    isPenalizeForNumLineUsedOn: {type: Boolean, default: false},
    isRawMaterialPrepareConstraintOn: {type: Boolean, default: false},

    isSafeStorageHardConstraint: {type: Boolean, default: false},
    penaltyForUseSafeStorage: {type: Number, default: 0},
    safeStorageCalculateMethod: {type: String},
    maxNumModeChangesDaily: {type: Number, default: 0},

    company: {type: Schema.Types.ObjectId, ref: 'Company'},

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