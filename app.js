var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var session = require('express-session');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//配置端口
var port = process.env.PORT || 3000;
var dbUrl = 'mongodb://localhost/ws_chat';
mongoose.connect(dbUrl);

app.set('views', './app/views');
app.set('view engine', 'ejs');

//指定一些静态资源的查找位置
app.use(express.static(path.join(__dirname, 'public')));

//返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());
app.use(session({
    secret:'ws_chat',
    store:new mongoStore({
        url:dbUrl,
        collection:'sessions'
    }),
    resave:false,
    saveUninitialized:true
}))

// development error handler
var env = process.env.NODE_ENV || 'development';
// will print stacktrace
if (env=== 'development') {
    app.set('showStackError',true);
    app.use(logger(':method :url :status'));//生成日志中间件
    app.locals.pretty = true;
}

io.on('connection',function(client){
    // client.on('event',function(data){});
    // client.on('event',function(){});
    console.log("一个新链接");
});

require('./config/router')(app,io);
server.listen(port,function(){
    console.log('服务成功启动：',port);
});


