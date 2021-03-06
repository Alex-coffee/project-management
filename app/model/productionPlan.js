var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ProductionPlanSchema = new Schema({
    date: {type: Date},
    amount: {type: Number},
    item: { type: Schema.Types.ObjectId, ref: 'Item'},
    scenario: { type: String, ref: 'Scenario'},
    company: { type: String, ref: 'Scenario'},
    line: { type: Schema.Types.ObjectId, ref: 'Line'},
    isLocked: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

ProductionPlanSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var ProductionPlan = mongoose.model('ProductionPlan', ProductionPlanSchema);

module.exports = ProductionPlan;