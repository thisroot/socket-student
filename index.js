var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//app.get('/', function(req, res){
//  res.sendFile(__dirname + '/index.html');
//});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log({my:'privet'});
  });
});

io.on('connection', function(socket){
  console.log('privet');  
  socket.on('struct', function(data){
    io.emit('struct', data);
    console.log(data);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

