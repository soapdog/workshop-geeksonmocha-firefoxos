
/**
 * Module dependencies.
 */


var express = require('express')
  , app = express()
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);


// all environments
app.set('port', process.env.PORT || 8083);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function (socket) {
    socket.emit('slideset', { slide: 0 });

    socket.on('masterset', function (data) {
        console.log("received masterset");
        console.log(data);
        socket.broadcast.emit('slideset', data);
    });

    socket.on('masteropenurl', function (data) {
        console.log("received master open url");
        console.log(data);
        socket.broadcast.emit('openurl', data);
    });
});


