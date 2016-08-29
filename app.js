var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var index = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//指定一些静态资源的查找位置
app.use(express.static(path.join(__dirname, 'public')));
//返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());

//表示先执行哪一个中间件
app.use('/',index);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        title:'错误',
        message: err.message,
        error: {}
    });
});

module.exports = app;


