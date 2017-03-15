//webpack支持commonJS风格的代码，所以可以识别require关键字
var $ = require("./jquery");
var io = require('./socket.io');
var Poplayer = require("./poplayer");
window.io = io;

window.$= $;
socket = window.io.connect();
//全局用户名
username = $('div.header input')[0].value;
var users = []; //存储在线用户
var userfriends = []; //存储好友


socket.emit('online', {
    user: username
});
socket.on('new_user_online', function(data) {
    //在线的人
    users = data.users;
    console.log(users);
    console.log(userfriends);
    //是好友
    users.forEach(function(item, index) {
        if (userfriends.indexOf(item) > -1) {
            $('ul li:nth(' + index + ') a').removeClass('offline');
        }
    });
    //保证顺序
    socket.on('showFriendList', function(data) {
        updateFriendsList(data);
    });
});
socket.on('toOne', function(msgObj) {
    var chat_name = msgObj.from;
    var index = userfriends.indexOf(chat_name);
    //如果没有建立对话框，模拟点击事件，注意js事件异步
    if (!Poplayer.instances[chat_name]) {
        $('.chat03_content ul li:nth(' + index + ')').click(function() {
            //
        });
    }else{   
        var dialogNode = Poplayer.instances[chat_name].dialogNode;
        var poplayerMessages = dialogNode.getElementsByClassName("poplayer-content")[0];
        $(dialogNode).insertAfter($('.poplayer-container:last'));

        var temp = "<div class='message'><div class='wrap-text'><h5 >" + msgObj.from + "</h5><div>" + filterXSS(msgObj.content) + "<div class='arrow'>" + "</div>" + "</div>" + "</div>" + "<div class='wrap-ri'>" + "<div ><span>" + msgObj.time + "</span></div>" + "</div>" + "<div style='clear:both;'></div>" + "</div>";
        $(poplayerMessages).append(temp);
        $(poplayerMessages).scrollTop($(poplayerMessages)[0].scrollHeight);
    }
});

function updateFriendsList(data) {
    var friends = [];
    var friendsListTemplate = '';
    var len = data.length || 0;
    if (len === 0) {
        friendsListTemplate = "迎使用WS_Chat，快点添加好友，开心聊天吧!"
    };
    for (var i = 0; i < len; i++) {
        friends.push(data[i].username);
        if (users.indexOf(data[i].username) < 0) {
            friendsListTemplate += '<li ><a href="#" class="chat03_name offline">' + data[i].username + '</a></li>';
        } else {
            friendsListTemplate += '<li ><a href="#" class="chat03_name">' + data[i].username + '</a></li>';
        }
    }
    userfriends = friends;
    $('.chat03_content ul').html(friendsListTemplate);
};

//添加好友
$('.search-icon').click(function(e) {
    var frName = $(".search-input").val();
    if (frName == "" || frName == null) {
        alert('请填写好友的账号');
    } else if (frName == username) {
        slert('不能添加叽叽为好友~');
    } else {
        $.ajax({
            url: '/user/addfriend',
            type: 'POST',
            data: 'friend=' + frName,
            success: function(mes) {
                var data = eval(mes);
                console.log(data);
                if (data.status == 0) {
                    console.log(data.Info);
                } else {
                    updateFriendsList(data.Info);
                }
            },
            error: function() {
                alert("此用户不存在或已存在用户列表");
            }
        })
    }
    $(".search-input").val("");
});


$('.chat03_content ul').on("double click", 'li', function() {
    var chat_name = $(this).text();

    if (Poplayer.instances[chat_name]) {
        //多窗口点击在最上面
        var dialogNode = Poplayer.instances[chat_name].dialogNode;
        $(dialogNode).insertAfter($('.poplayer-container:last'));

    } else {
        // var socket = window.io.connect();
        // socket.emit('searchChatContent', {
        //     from: username,
        //     to: chat_name
        // });
        // socket.on('backChatContent', function(content) {
        // console.log(content);
        $.ajax({
            url: '/getMessageList',
            type: 'POST',
            data: {
                from: username,
                to: chat_name
            },
            success: function(mes) {
                var content = "";
                mes.forEach(function(message, index) {
                    content += "<div class='message'><div class='wrap-text'><h5 >" + message.from + "</h5><div>" + filterXSS(message.content) + "<div class='arrow'>" + "</div>" + "</div>" + "</div>" + "<div class='wrap-ri'>" + "<div ><span>" + message.time + "</span></div>" + "</div>" + "<div style='clear:both;'></div>" + "</div>";
                });
                var pop = new Poplayer({
                    title: chat_name,
                    isModal: false,
                    content: content,
                });
                pop.init().show();
            }
        })
    }
});

//退出登录
$('.chat_close').click(function() {
    var pop = '<div class="poplayer-mask"></div><div class="danger_layer"><div class="danger_layer_header">' +
        '<div>提示</div>' +
        '<div class="danger_layer_close"> × </div>' +
        '</div>' +
        '<div class="danger_layer_content">您还有会话没有关闭，确认退出chat吗？</div>' +
        '<div class="danger_layer_footer">' +
        '<button class="btn btn-confirm">确定</button>' +
        '<button class="btn btn-cancel">取消</button>' +
        '</div>' +
        '</div></div>';
    $('body').append(pop);

    $('.danger_layer_close').click(function() {
        $('.poplayer-mask').remove();
        $('.danger_layer').remove();
    });

    $('.danger_layer_footer .btn-cancel').click(function() {
        $('.poplayer-mask').remove();
        $('.danger_layer').remove();
    });

    $('.danger_layer_footer .btn-confirm').click(function() {

        socket.emit('self_disconnect', {
            username: username
        });
        window.location = "/signin";
    })

})