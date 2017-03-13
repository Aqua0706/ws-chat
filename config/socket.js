var User = require('../app/models/user.js');
var Message = require('../app/models/message.js');
var _ = require('underscore');

module.exports = function(users, io) {
    io.sockets.on('connection', function(socket) {
        socket.on('online', function(data) {
            socket.name = data.user;
            console.log(socket.name);
            console.log('dfy');
            if (users.indexOf(data.user) < 0) {
                users.push(data.user);
            };

            io.emit('new_user_online',{
                users: users,
                user: data.user
            });

            User.findOne({
                username: data.user
            }, function(err, user) {
                if (err) {
                    console.log(err);
                }
                socket.emit('showFriendList', user.friends);
            });
        });

        socket.on('self_disconnect', function(mes) {

            var user = _.findWhere(users, mes.username);

            if (user) {
                users = _.without(users, user);
                // _.without(io.sockets.sockets, user);
                console.log('我下线啦0');
                //socket.broadcast.emit('loginInfo',username + '下线了')
            }
        });

        socket.on('sendMessageToOne', function(msgObj) {
            var toSocket = _.findWhere(io.sockets.sockets, {
                name: msgObj.to
            });
            console.log(toSocket);

            //插入数据
            var message = new Message(msgObj);
            message.save(function(err, mes) {
                if (err) {
                    console.log(err);
                }

                toSocket.emit('toOne', msgObj);

                //向对方发起一个say的事件
                console.log("成功");

            });
        });

    });
}