var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

require('./js/dbmodels.js');

//// sending to sender-client only
// отправк только отправителю
//socket.emit('message', "this is a test");
//
//// sending to all clients, include sender
// отправить всем клиентам включая отправителя
//io.emit('message', "this is a test");
//
//// sending to all clients except sender
// отправить всем клиентам исключая отправителя
//socket.broadcast.emit('message', "this is a test");
//
//// sending to all clients in 'game' room(channel) except sender
//socket.broadcast.to('game').emit('message', 'nice game');
//
//// sending to all clients in 'game' room(channel), include sender
//io.in('game').emit('message', 'cool game');
//
//// sending to sender client, only if they are in 'game' room(channel)
//socket.to('game').emit('message', 'enjoy the game');
//
//// sending to all clients in namespace 'myNamespace', include sender
//io.of('myNamespace').emit('message', 'gg');
//
//// sending to individual socketid
//socket.broadcast.to(socketid).emit('message', 'for your eyes only');



io.on('connection', function(socket){
    // change in structure of item

  socket.on('struct message', function(data){
      socket.join(data.id_block);
      // save in DB
      console.log(data);
      if(data.action === 'delete-item') {}
      else {
      global.LectureState.upsert({
                    id_lecture: data.id_block,
                    state_header: JSON.stringify([data.id_owner,data.id_user]),
                    state_items: JSON.stringify([data.id_item])}).then(function () {});
      }
      socket.broadcast.to(data.id_block).emit('struct message', data);
  });
});

io.on('connection', function(socket){
  socket.on('get-struct message', function(data){
      console.log(data);
      
      global.Decode('sZ5gz9EBe959XKgnsdEwNN7QLAKK6vnxQMnhEuKDT0g').then(function(result){
        global.decoded = result;
      });
      console.log(global.decoded);

     // get saved structure item
    //socket.join(data.id_block);
    // sending to sender client
    socket.emit('get-struct message', data);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});