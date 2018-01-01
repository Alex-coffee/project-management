var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var CompanySchema = new Schema({
    name: {type: String},
    desc: {type: String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

CompanySchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var Company = mongoose.model('Company', CompanySchema);

module.exports = Company;