var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ORInputSchema = new Schema({
    LineStaticData: {type: Object},
    LockedSchedule: {type: Object},
    OrderRawMaterials: {type: Object},
    Orders: {type: Object},
    Parameters: {type: Object},
    ProductStaticData: {type: Object},
    RawMaterials: {type: Object},
    RawOrderMap: {type: Object},
    scenario: { type: Schema.Types.ObjectId, ref: 'Scenario'},

    isDeleted: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

ORInputSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var ORInput = mongoose.model('ORInput', ORInputSchema);

module.exports = ORInput;