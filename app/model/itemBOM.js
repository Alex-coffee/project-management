var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ItemBOMSchema = new Schema({
    item: { type: Schema.Types.ObjectId, ref: 'Item'},
    materials: [{ 
        item: {type: Schema.Types.ObjectId, ref: 'Item'},
        amount:  {type: Number}
    }],
    //scenario: { type: Schema.Types.ObjectId, ref: 'Scenario'},
    company: {type: String, ref: 'Company'},
    isDeleted: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

ItemBOMSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var ItemBOM = mongoose.model('ItemBOM', ItemBOMSchema);

module.exports = ItemBOM;