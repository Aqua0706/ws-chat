var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var ObjectId = Schema.Types.ObjectId;

var MessageSchema = new Schema({
    from: String,
    to: String,
    content:String,
    time:{type:Date,default:Date.now()}
});

MessageSchema.statics = {
    fetch:function(_from,_to,cb){
        return this
        .find({},{from:_from,to:_to},{limit:10})
        .sort('time')
        .exec(cb)
    }
}

module.exports = MessageSchema;