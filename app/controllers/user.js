//控制跟用户相关的请求
var User = require('../models/user');

//showsignup
exports.showSignup = function(req,res){
    res.render('signup',{
        title:'注册页面'
    })
} 

//showsignin
exports.showSignin = function(req,res){
    res.render('signin',{
        title:'登陆页面'
    })
} 

//signup
exports.signup = function(req,res){
    var _user = req.body.user;

    User.findOne({
        username:_user.username
    },function(err,user){
        if(err){
            console.log(err);
        }

        if(user){
            return res.redirect('/signin');
        }else{
            var user = new User(_user);
            console.log(user);
            user.save(function(err,user){
                if(err){
                    console.log(err);
                }
                res.redirect('/chat');
            })
        }
    })
}

//signin
exports.signin = function(req,res){
    var _user = req.body.user;
    var username = _user.username;
    var password = _user.password;

    User.findOne({
        username:username
    },function(err,user){
        if(err){
            console.log(err);
        }

        if(!user){
            return res.redirect('/signup');
        }

        var isMatch = user.authenticate(password);
        if(isMatch){
            //设置req
            req.session.user = user;
            return res.redirect('/chat');
        }else{
            return res.redirect('/signin');
        }
    })
}

//chat
exports.chat = function(req,res){
    res.render('chat');
}
//midware
exports.signinRequired = function(req,res,next){
    var user = req.session.user;
    if(!user){
        return res.redirect('/signin');
    }
    next();
}