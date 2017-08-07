var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var OrderDemandSchema = new Schema({
    date: {type: Date},
    amount: {type: Number},
    item: { type: Schema.Types.ObjectId, ref: 'Item'},
    scenario: { type: Schema.Types.ObjectId, ref: 'Scenario'},
    isDeleted: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

OrderDemandSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var OrderDemand = mongoose.model('OrderDemand', OrderDemandSchema);

module.exports = OrderDemand;