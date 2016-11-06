var cluster = require('cluster');  
var express = require('express');  
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {  
    for (var i = 0; i < numCPUs; i++) {
        // Create a worker
        cluster.fork();
    }
} else {
    // Workers share the TCP connection in this server
    var app = express();
    var http = require('http').Server(app);
var io = require('socket.io')(http);
var dbm = require('../js/dbmodels.js');

 dbm.Sync(function () {
            global.cryptkey = dbm.asyncGetRegistry.sync(null, 'module_crypt_key');  
 });

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });
    
    io.on('connection', function(socket){
    // change in structure of item

  socket.on('struct message', function(data){
      socket.join(data.id_block);
      // save in DB
      console.log(data);
      if(data.action === 'delete-item') {}
      else {
      dbm.LectureState.upsert({
                    id_lecture: data.id_block,
                    state_header: JSON.stringify([data.id_owner,data.id_user]),
                    state_items: JSON.stringify([data.id_item])}).then(function () {});
      }
      socket.broadcast.to(data.id_block).emit('struct message', data);
  });
});

io.on('connection', function(socket){
  socket.on('get-struct message', function(data){
      // в синхронной области декодируем запрошенные значения.
        dbm.Sync(function () {
            // а я куплю велосипед => лень конвертировать utf-16 в utf-8
            // http://stackoverflow.com/questions/14403377/strange-unicode-characters-when-reading-in-file-in-node-js-app
            data.id_block = dbm.Decode(data.id_block,global.cryptkey).split("\u0000")[0];
            data.id_user = dbm.Decode(data.id_user,global.cryptkey).split("\u0000")[0];
            data.id_owner = dbm.Decode(data.id_owner,global.cryptkey).split("\u0000")[0];
        });
        
    // get saved structure item
    //socket.join(data.id_block);
    // sending to sender client
    socket.emit('get-struct message', data);
  });
});

    // All workers use this port
    app.listen(3000);
}