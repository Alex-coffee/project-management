var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    pwd: {type: String, required: true},
    email: {type: String, required: true},
    company: {type: String},
    type: {type: String},
    isActive: {type: Boolean, default: true},
    isDeleted: {type: Boolean, default: false},
    lastLoginTime: { type: Date},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var User = mongoose.model('User', UserSchema);

// make this available to our users in our Node applications
module.exports = User;