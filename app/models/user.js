var mongoose = require('mongoose');
crypto = require('crypto');

var UserSchema = require('../schemas/user');
var User = mongoose.model('User',UserSchema);

module.exports = User;