//控制跟消息相关的请求
var Message = require('../models/message');

//getMes
exports.getMes = function(req, res) {
    var from = req.body.from;
    var to = req.body.to;
    var mesObj = [];
    Message.find({
        from: eval('/'+from+'|'+to+'/'),
        to: eval('/'+from+'|'+to+'/')
    }, function(err,mes) {
        res.send(mes);
    });
}

// User.findOne({
//         username: _user.username
//     }, function(err, user) {
//         if (err) {
//             console.log(err);
//         }

//         if (user) {
//             return res.redirect('/signin');
//         } else {
//             var user = new User(_user);
//             console.log(user);
//             user.save(function(err, user) {
//                 if (err) {
//                     console.log(err);
//                 }
//                 res.redirect('/signin');
//             })
//         }
//     })