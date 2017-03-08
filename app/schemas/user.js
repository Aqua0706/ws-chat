/**
 * 用户数据模型
 */

 var mongoose = require('mongoose');
 crypto = require('crypto');

 var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    salt: String,
    avatar:String,
    friends:{
        type: Array,
        default: []
    }
 })

 /**
 * save方法前进行密码哈希化
 */
UserSchema.pre('save', function (next) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
    next();
});

/**
 * 为哈希密码创建实例方法
 */
UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * 为验证用户创建实例方法
 */
UserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};

//静态方法:通过模型来调用
UserSchema.statics = {//添加一个静态方法，静态方法从模型上去调用 
    fetch:function(cb){
        return this
        .find({})
        .sort("meta.updateAt")
        .exec(cb)
    },
    findById:function(id,cb){
        return this
        .findOne({_id:id})
        .exec(cb)
    }
}

module.exports = UserSchema;