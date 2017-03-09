var User = require('../app/models/user.js');

module.exports = function(users,io) {
    io.sockets.on('connection', function(socket) {
        socket.on('online', function(data) {
            socket.name = data.user;
            if (users.indexOf(data.user) < 0) {
                users.push(data.user);
            }
            io.sockets.emit('online', {
                users: users,
                user: data.user
            });

            User.findOne({username:data.user},function(err,user){
                if(err){
                    console.log(err);
                }   
                socket.emit('showFriendList',user.friends);
            })
        });

        socket.on('say', function(data) {
            console.log(data);
        });

        socket.on('searchChatContent',function(data){
            socket.emit('backChatContent',"大家好")
        })
    });
}