//connection to host and port
var socket = io();





//when user login or logout,system notice


//add user in <ul>
socket.on('userlist',function(userList){
	//modify user count
	//modifyUserCount(userList.length);
	addUser(userList);
});

//client review user information after login
socket.on('userInfo',function(userObj){

	userSelf = userObj;
	//$('#spanuser').text('欢迎你！'+userObj.name);
});


//review message from toOne
socket.on('toOne',function(msgObj){
	var id = msgObj.from.id;
	var chatboxId='';
	var index='';
	// $.each(userList,function(i,iteam){
	// 	$.each(iteam,)
	// })
	for(var i = 0;i<userlist.length;i++){
		if(userlist[i].id == id){
			chatboxId = '#chatbox'+i;
			index = i;
		}
	}
	
	//发来消息的这个对话框还没有建立
	if($(chatboxId).length == 0){
		showSetMsgToOne(msgObj.from.name,msgObj.from.id,index);
	}
	
	addMsgFromUser(msgObj,false,chatboxId);
})
