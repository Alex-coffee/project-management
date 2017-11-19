var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var LineSchema = new Schema({
    name: {type: String},
    availableHours: {type: Number},
    turnHours: {type: Number},
    lineCloseSchedule: {type: Object},
    scenario: { type: Schema.Types.ObjectId, ref: 'Scenario'},
    isDeleted: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

LineSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var Line = mongoose.model('Line', LineSchema);

module.exports = Line;