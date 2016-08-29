var app = require('../app');
var http = require('http');
app.set('port',process.env.PORT || 8080);

var server = app.listen(app.get('port'),function(){
	console.log('ws_chat server listening on port '+server.address().port);
});

require('../chat').listen(server);