var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ItemSchema = new Schema({
    name: {type: String},
    desc: {type: String},
    type: {type: String},
    cost: {type: Number},
    storageCost: {type: Number},
    saftyStorage: {type: Number},
    advAmount: {type: Number},
    priority: {type: Number},
    initialStorage: {type: Number, default: 0},
    minProductAmount: {type: Number},
    useItem: {type: Boolean, default: false},
    refItem: { type: Schema.Types.ObjectId, ref: 'Item'},
    scenario: { type: Schema.Types.ObjectId, ref: 'Scenario'},

    isDeleted: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

ItemSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;