//控制跟用户相关的请求
var User = require('../models/user');

//showsignup
exports.showSignup = function(req, res) {
    //退出的当前账号时，重定向，并删除session
    delete req.session.user;
    res.render('signup', {
        title: '注册页面'
    })
}

//showsignin
exports.showSignin = function(req, res) {
    delete req.session.user;
    res.render('signin', {
        title: '登陆页面'
    })
}

//signup
exports.signup = function(req, res) {
    var _user = req.body.user;

    User.findOne({
        username: _user.username
    }, function(err, user) {
        if (err) {
            console.log(err);
        }

        if (user) {
            return res.redirect('/signin');
        } else {
            var user = new User(_user);
            console.log(user);
            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/signin');
            })
        }
    })
}

//signin
exports.signin = function(req, res) {
    var _user = req.body.user;
    var username = _user.username;
    var password = _user.password;

    User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            console.log(err);
        }

        if (!user) {
            return res.redirect('/signup');
        }

        var isMatch = user.authenticate(password);
        if (isMatch) {
            //设置req
            req.session.user = user;
            return res.redirect('/chat');
        } else {
            return res.redirect('/signin');
        }
    })
}

//chat
exports.chat = function(req, res) {
    res.render('chat');
}

//addFriend
exports.addFriend = function(req, res) {
    var newfriend = req.body.friend;
    var data;

    var user_now = req.session.user;
    console.log(user_now);
    User.findOne({
        username: newfriend
    }, function(err, firend) {
        if (err) {
            console.log(err);
        }

        if (!firend) {
            res.json({
                status: 0,
                Info: "查无此用户"
            });
        } else {
            var flag = false;
            for (var i = 0; i < user_now.friends.length; i++) {
                if (user_now.friends[i].username == newfriend) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                res.json({
                    status: 0,
                    Info: newfriend + " 已是您的好友！"
                })
            } else {
                user_now.friends.push({
                    username: newfriend
                });

                User.findOneAndUpdate({
                    username: user_now.username
                }, {
                    password: user_now.password,
                    username: user_now.username,
                    salt: user_now.salt,
                    avatar: user_now.avatar,
                    friends: user_now.friends
                }, function(err, user) {
                    if (err) {
                        res.json({
                            status: 0,
                            Info: err.toString()
                        })
                    } else {
                        res.json({
                            status: 200,
                            Info: user_now.friends
                        });
                        console.log('哈哈哈');
                    }
                })
            }
        }
    })
}

//midware
exports.signinRequired = function(req, res, next) {
    var user = req.session.user;
    if (!user) {
        return res.redirect('/signin');
    }
    next();
}