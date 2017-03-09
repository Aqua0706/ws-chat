var socket = window.io.connect();
var username = $('div.header input')[0].value;


socket.emit('online', {
    user: username
});
socket.on('online', function(data) {
    console.log(data.users);
});
socket.on('showFriendList', function(data) {
    updateFriendsList(data);
});

function updateFriendsList(data) {
    var friendsListTemplate = '';
    var len = data.length || 0;
    if (len === 0) {
        friendsListTemplate = "迎使用WS_Chat，快点添加好友，开心聊天吧!"
    };
    for (var i = 0; i < len; i++) {
        friendsListTemplate += '<li ><a href="#" class="chat03_name">' + data[i].username + '</a></li>';
    }

    $('.chat03_content ul').html(friendsListTemplate);
};

//添加好友
$('.search-icon').click(function(e) {
    var frName = $(".search-input").val();
    if (frName == "" || frName == null) {
        alert('请填写好友的账号');
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
    } else {
        var socket = window.io.connect();
        socket.emit('searchChatContent', {
            from: username,
            to: chat_name
        });
        socket.on('backChatContent', function(content) {
            console.log(content);
            var pop = new Poplayer({
                title: chat_name,
                isModal: false,
                content: content
            })
            pop.init().show();

        })
    }
})