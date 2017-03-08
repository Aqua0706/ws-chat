var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MessageSchema = new Schema({
    form: {type:ObjectId,ref:'User'},
    to:{type:ObjectId,ref:'User'},
    content:String,
    time:{type:Date,default:Date.now()}
});

MessageSchema.statics = {
    fetch:function(from,to,cb){
        return this
        .find({},{_from:from,_to:to},{limit:10})
        .sort('time')
        .exec(cb)
    }
}

module.exports=MessageSchema;