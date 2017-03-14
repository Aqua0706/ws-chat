/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function Poplayer(args) {
    this.isModal = args.isModal || false; //是否模态
    this.moveable = args.moveable || true; //是否可移动
    this.title = args.title || "";
    this.content = args.content || "";
    this.width = args.width || "auto";
    this.onShow = args.onShow || function() {};
    this.onClose = args.onClose || function() {};
    this.onDestory = args.onDestory || function() {};
    this.onConfirm = args.onConfirm || function() {};
    this.onCancel = args.onCancel || function() {};
    // this.id = (Math.random()).toString('16').substring(2, 10); //标识当前弹框
}

//弹层实例池
Poplayer.instances = {};

Poplayer.prototype.init = function() {
    // var content = this.content instanceof Node && this.content.nodeType == 1 ? this.content.outerHTML : this.content;
    var content = this.content;
    // console.log(content);
    var dialogTemplate = '<div class="poplayer-header">' +
        '<div class="poplayer-title">' + this.title + '</div>' +
        '<div class="poplayer-close"> × </div>' +
        '</div>' +
        '<div class="poplayer-content">' +
        content +
        '</div>' +
        '<div class="poplayer-footer">' +
        '<div class="poplayer-action clearfix">' +
        '<input type="text" class="poplayer-input"/>' +
        '<button class="btn btn-confirm">确定</button>' +
        '</div>' +
        '</div>';

    //var maskNode = document.createElement("div");
    var dialogNode = document.createElement("div");

    //maskNode.setAttribute("class", "poplayer-mask");
    dialogNode.setAttribute("class", "poplayer-container");
    dialogNode.style.width = this.width + "px";
    dialogNode.innerHTML = dialogTemplate;

    Poplayer.instances[this.title] = this;

    //this.maskNode = maskNode;
    this.dialogNode = dialogNode;

    return this;
}

/**
 * 弹出层事件绑定，显示弹出层
 */
Poplayer.prototype.show = function() {
    typeof this.onShow == "function" && this.onShow();

    this.isModal && document.body.appendChild(this.maskNode);
    document.body.appendChild(this.dialogNode);

    var poplayerHeader = this.dialogNode.getElementsByClassName("poplayer-header")[0],
        poplayerContainer = this.dialogNode,
        poplayerMessages = this.dialogNode.getElementsByClassName("poplayer-content")[0],
        poplayerClose = this.dialogNode.getElementsByClassName("poplayer-close")[0],
        inputMes = this.dialogNode.getElementsByClassName("poplayer-input")[0],
        btnConfirm = this.dialogNode.getElementsByClassName("btn-confirm")[0],
        // btnCancel = this.dialogNode.getElementsByClassName("btn-cancel")[0],
        self = this;


    poplayerHeader.onclick = function() {
        var dialogNode = self.dialogNode;
        $(dialogNode).insertAfter($('.poplayer-container:last'));
    }

    poplayerClose.onclick = function(e) {
        self.close().destroy();
        e.stopPropagation();
    }

    btnConfirm.onclick = function() {
        // typeof self.onConfirm == 'function' && self.onConfirm();
        // self.close().destroy();
        var msgObj = {
            from: username,
            to: self.title,
            content: inputMes.value,
            time:Date.now()
        };
        socket.emit('sendMessageToOne', msgObj);
        var temp = "<div class='message'><div class='wrap-text'><h5 >" + msgObj.from + "</h5><div>" + filterXSS(msgObj.content) + "<div class='arrow'>" + "</div>" + "</div>" + "</div>" + "<div class='wrap-ri'>" + "<div ><span>" + msgObj.time + "</span></div>" + "</div>" + "<div style='clear:both;'></div>" + "</div>";
        $(poplayerMessages).append(temp);


        $(poplayerMessages).scrollTop($(poplayerMessages)[0].scrollHeight);
        $(inputMes).val("");
    }

    // btnCancel.onclick = function() {
    //     typeof self.onCancel == 'function' && self.onCancel();
    //     self.close().destroy();
    // }

    if (this.moveable) { // 是否可移动
        poplayerHeader.onmousedown = function(e) {
            var oEvent = e || window.event,

                originPoint = { // 当前鼠标的坐标；
                    x: oEvent.clientX,
                    y: oEvent.clientY
                },
                offset = {
                    offsetLeft: poplayerContainer.offsetLeft,
                    offsetTop: poplayerContainer.offsetTop
                },
                params = { // 弹出层目前所在的位置（绝对定位）
                    left: parseInt(window.getComputedStyle(poplayerContainer).left),
                    top: parseInt(window.getComputedStyle(poplayerContainer).top)
                };

            document.onmousemove = function(e) {
                var oEvent = e || window.event,
                    currentPoint = { // 当前鼠标的坐标；
                        x: oEvent.clientX,
                        y: oEvent.clientY
                    },
                    moveDis = {
                        x: currentPoint.x - originPoint.x,
                        y: currentPoint.y - originPoint.y
                    };
                // 防止弹出层溢出 
                if (currentPoint.x - originPoint.x + offset.offsetLeft <= 0) {
                    moveDis.x = -offset.offsetLeft;
                }
                if (currentPoint.x - originPoint.x + offset.offsetLeft >= document.documentElement.clientWidth - poplayerContainer.offsetWidth) {
                    moveDis.x = document.documentElement.clientWidth - poplayerContainer.offsetWidth - offset.offsetLeft;
                }
                if (currentPoint.y - originPoint.y + offset.offsetTop <= 0) {
                    moveDis.y = -offset.offsetTop;
                }
                if (currentPoint.y - originPoint.y + offset.offsetTop >= document.documentElement.clientHeight - poplayerContainer.offsetHeight) {
                    moveDis.y = document.documentElement.clientHeight - poplayerContainer.offsetHeight - offset.offsetTop;
                }
                poplayerContainer.style.left = params.left + moveDis.x + 'px';
                poplayerContainer.style.top = params.top + moveDis.y + 'px';
            }

        }
        document.onmouseup = function() {
            document.onmousemove = null;
        }
    }

    return this;

}

/**
 * 发送消息函数
 */
Poplayer.prototype.send = function() {
    typeof this.onClose == "function" && this.onClose();
    //document.body.removeChild(this.maskNode);
    document.body.removeChild(this.dialogNode);
    return this;
}


/**
 * 弹出层关闭函数
 */
Poplayer.prototype.close = function() {
    typeof this.onClose == "function" && this.onClose();
    //document.body.removeChild(this.maskNode);
    document.body.removeChild(this.dialogNode);
    return this;
}

/**
 * 弹出层销毁函数
 */
Poplayer.prototype.destroy = function() {
    typeof this.onDestroy == "function" && this.onDestroy();
    delete Poplayer.instances[this.title];
    return null;
}


module.exports = Poplayer;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var Poplayer = __webpack_require__(0);
var socket = window.io.connect();
var username = $('div.header input')[0].value;
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

/***/ })
/******/ ]);