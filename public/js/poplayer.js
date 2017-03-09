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
    var content = this.content instanceof Node && this.content.nodeType == 1 ? this.content.outerHTML : this.content;
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
        poplayerClose = this.dialogNode.getElementsByClassName("poplayer-close")[0],
        btnConfirm = this.dialogNode.getElementsByClassName("btn-confirm")[0],
        btnCancel = this.dialogNode.getElementsByClassName("btn-cancel")[0],
        self = this;

    poplayerClose.onclick = function() {
        self.close().destroy();
    }
    btnConfirm.onclick = function() {
        typeof self.onConfirm == 'function' && self.onConfirm();
        self.close().destroy();
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