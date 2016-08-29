
var io = require('socket.io')();
var _ = require('underscore');



//api
/*

socket.emit('message', "this is a test");  // send to current request socket client

socket.broadcast.emit('message', "this is a test");  // sending to all clients except sender

socket.broadcast.to('game').emit('message', 'nice game');  // sending to all clients in 'game' room(channel) except sender

io.sockets.emit('message', "this is a test"); // sending to all clients, include sender
 
io.sockets.in('game').emit('message', 'cool game'); // sending to all clients in 'game' room(channel), include sender

io.sockets.socket(socketid).emit('message', 'for your eyes only'); // sending to individual socketid
*/

/*user list
Format:[
	{
		name:"",
		img:"",
		socketid:""
	}
]
*/
//'使用一个数组对象存储socket链接'
var userList = [];

io.on('connection', function(socket) {

  console.log('a user connected');
  
  //login function
  socket.on('login',function(user){
  	user.id = socket.id;
  	userList.push(user);
  	//send the userlist to all client
  	io.emit('userlist',userList);

  	//send the client information to client
  	socket.emit('userInfo',user);
  	
  	socket.broadcast.emit('loginInfo',user.name+"上线了");

  });

  //login out
  socket.on('disconnect',function(){
  	var user = _.findWhere(userList,{id:socket.id});
  	if(user){
  		userList = _.without(userList,user);
  		//send the userlist to all client
  	//io.emit('userlist',userlist);
  		socket.broadcast.emit('loginInfo',user.name + ' 下线了。 ');
  	}
  });

 //  //send to all
	// socket.on('toAll',function(msgObj){
	// 	/*
	// 		format:{
	// 			from:{
	// 				name:"",
	// 				img:"",
	// 				id:""
	// 			},
	// 			msg:""
	// 		}
	// 	*/
	// 	socket.broadcast.emit('toAll',msgObj);
	// });
	// //sendImageToALL
	// socket.on('sendImageToALL',function(msgObj){
	// 	/*
	// 		format:{
	// 			from:{
	// 				name:"",
	// 				img:"",
	// 				id:""
	// 			},
	// 			img:""
	// 		}
	// 	*/
	// 	socket.broadcast.emit('sendImageToALL',msgObj);
	// })


  //send to one
  socket.on('toOne', function(msgObj) {
  	/*
			format:{
				from:{
					name:"",
					img:"",
					id:""
				},
				to:"",  //socketid
				msg:""
			}
		*/
    //console.log(user + ' sent a private message to ' + to + ' .');
	var toSocket = _.findWhere(io.sockets.sockets,{id:msgObj.to});

    console.log(toSocket);
	toSocket.emit('toOne', msgObj);
  });

});

exports.listen = function(_server){
	io.listen(_server);
}