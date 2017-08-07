var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ProductStaticSchema = new Schema({
    proudct: { type: Schema.Types.ObjectId, ref: 'Item'},
    mainLine: { type: Schema.Types.ObjectId, ref: 'Line'},
    subLine: { type: Schema.Types.ObjectId, ref: 'Line'},
    unitTime: { type: Number},
    scenario: { type: Schema.Types.ObjectId, ref: 'Scenario'},
    isDeleted: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

ProductStaticSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var ProductStatic = mongoose.model('ProductStatic', ProductStaticSchema);

module.exports = ProductStatic;