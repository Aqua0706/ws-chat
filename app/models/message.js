var mongoose = require('mongoose');

var MessageSchema = require('../schemas/message');
var Message = mongoose.model('User',MessageSchema);

module.export = Message;