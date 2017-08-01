var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var KPISchema = new Schema({
    line: { type: Schema.Types.ObjectId, ref: 'Line'},
    productTypeNo: {type: Number},
    availableHours: {type: Number},
    reqHours: {type: Number},
    scenario: { type: Schema.Types.ObjectId, ref: 'Scenario'},
    isDeleted: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

KPISchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var KPI = mongoose.model('KPI', KPISchema);

module.exports = KPI;