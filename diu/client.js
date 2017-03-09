var userSelf = {};
var toOneId;
var count = 0; //z-index
var currchatBox = $('.bb');
var userlist;
//var currchatBoxid = currchatBox.selector;

//$(function(){});是$(document).ready(function(){ })的简写.
$(function() {

	//通过javascript来调用模态框，还有另一种通过data属性设置来调用
	$('#myModal').modal({
		//escape键无效，不会退出模态框
		keyboard: false
	});
	//$('.popover-dismiss').popover('show');

	//login
	$('#btn-setName').click(function() {
		var name = $('#username').val();

		if (checkUser(name)) {
			$('#username').val('');
			alert('Nickname already exists or can not be empty!');
		} else {
			var imgList = ['/images/1.jpg', '/images/2.jpg', "/images/3.jpg", "/images/4.jpg", "/images/5.jpg"];
			var randomNum = Math.floor(Math.random() * 5);

			//random user
			var img = imgList[randomNum];

			//package user
			var dataObj = {
				name: name,
				img: img
			};

			//send user info to server
			socket.emit('login', dataObj);

			//hide login modal
			$('#myModal').modal('hide');
			$('#username').val('');
			$('#usernameshow').text(name);
		}
	});


});



//send message to one
function change(){
	var msg = $(currchatBox.selector).find('.msg').val();
	if(msg==''){
		alert('Please enter the message content!');
		return;
	}
	var from = userSelf;
	var msgObj = {
		from:from,
		to:toOneId,
		msg:msg
	};
	socket.emit('toOne',msgObj);
	addMsgFromUser(msgObj,true,currchatBox.selector);
	$(currchatBox.selector).find('.msg').val('');
}

//add message in UI
function addMsgFromUser(msgObj,isSelf,chatboxObj){
	var msgType = isSelf?"message-reply":"message-receive";
	var msgHtml = $('<div><div class="message-info"><div class="user-info"><img src="/images/1.jpg" class="user-avatar img-thumbnail"></div><div class="message-content-box"><div class="arrow"></div><div class="message-content">test</div></div></div></div>');
	msgHtml.addClass(msgType);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('src',msgObj.from.img);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('title',msgObj.from.name);
	msgHtml.children('.message-info').children('.message-content-box').children('.message-content').text(msgObj.msg);
	$(chatboxObj+" .msg-content").append(msgHtml);
	//滚动条一直在最底
	$(chatboxObj+" .msg-content").scrollTop($(chatboxObj+" .msg-content")[0].scrollHeight);
}

//check is the username exist
function checkUser(name) {
	var haveName = false;
	$('.user-content').children('ul').children('li').each(function() {
		if (name == $(this).find('span').text()) {
			haveName = true;
		}
	});
	return haveName;
}

//add user in ui
function addUser(userList) {
	userlist = userList
	var parentUI = $('.user-content').children('ul');
	var cloneLi = parentUI.children('li:first').clone();
	parentUI.html('');
	parentUI.append(cloneLi);
	for (var i in userList) {
		var cloneLi = parentUI.children('li:first').clone();
		cloneLi.children('a').attr('href', "javascript:showSetMsgToOne('" + userList[i].name + "','" + userList[i].id + "','" + i + "');");
		cloneLi.children('a').children('img').attr('src', userList[i].img);
		cloneLi.children('a').children('span').text(userList[i].name);
		cloneLi.show();
		cloneLi.attr('id', 'chat' + i);
		parentUI.append(cloneLi);
	}
}

//set name enter function
function keywordsName(e) {
	var event = e || window.event;
	if (event.keycode == 13) {
		$('#btn-setName').click();
	}
}

//前端触发
function keywordsMsg(e) {
	var event1 = e || window.event;
	if (event1.keyCode == 13) {
		//模拟一次点击事件
		$(currchatBox.selector).find('.sendMsg').click();
	}
}
//show chat boxs
function showSetMsgToOne(name, id, index) {

	toOneId = id;
	//每次触发z-index++,保持会话处于最前
	count++;
	var temp = $('#chatbox' + index);
	if (temp.length == 0) {

		var parentBox = $('.chatbox').clone();
		parentBox.attr('style', 'display:block');
		parentBox.css({
			'position': 'absolute'
		});
		parentBox.attr('id', 'chatbox' + index);

		parentBox.find('.spanuser').text(name);
		$('.col-sm-9').append(parentBox);
	}
	temp.css('z-index', count);

	currchatBox = temp;
	temp.find('.msg').focus();
}