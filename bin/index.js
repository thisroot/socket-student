//require('sticky-socket-cluster/replace-console')();
// prefixes console output with worker ids.
var CPUCount = require("os").cpus().length;


var options = {
    workers: CPUCount, // total workers (default: cpu cores count).
    first_port: 8000, // 8000, 8001 are worker's ports (default: 8000).
    proxy_port: 3000, // default (5000).
    session_hash: function (req, res) {
        return req.connection.remoteAddress;
    },
    // can use cookie-based session ids and etc. (default: int31 hash).

    no_sockets: false // allow socket.io proxy (default: false).
};

require('sticky-socket-cluster')(options, start);

function start(port) {

    var app = require('express')();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var dbm = require('../js/dbmodels.js');

    if (!global.cryptkey) {
        dbm.Sync(function () {
            global.cryptkey = dbm.asyncGetRegistry.sync(null, 'module_crypt_key');
        });
    }

    io.on('connection', function (socket) {
        // change in structure of item

        socket.on('struct message', function (data) {
            socket.join(data.id_block);
            // save in DB
            console.log(data);
            if (data.action === 'delete-item') {

            }
            else if((data.action === 'move-item')) {

            }
            else if((data.action === 'edit-name-item')) {

            }
            else {

               /* dbm.LectureState.upsert({
                    id_lecture: data.id_block,
                    state_header: JSON.stringify([data.id_owner, data.id_user]),
                    state_items: JSON.stringify([data.id_item])}).then(function () {}); */
                
                dbm.LectureBlock.update({
                    state: JSON.stringify(data.state)
                },{ where: {
                                id_lecture: data.id_block,
                                id_block: data.id_item 
                            }
                });
            }
            socket.broadcast.to(data.id_block).emit('struct message', data);
        });
    });

    io.on('connection', function (socket) {
        socket.on('get-struct message', function (data) {
            // в синхронной области декодируем запрошенные значения.
            dbm.Sync(function () {
                // а я куплю велосипед => лень конвертировать utf-16 в utf-8
                // http://stackoverflow.com/questions/14403377/strange-unicode-characters-when-reading-in-file-in-node-js-app
                data.id_block = dbm.Decode(data.id_block, global.cryptkey).split("\u0000")[0];
                data.id_user = dbm.Decode(data.id_user, global.cryptkey).split("\u0000")[0];
                data.id_owner = dbm.Decode(data.id_owner, global.cryptkey).split("\u0000")[0];
            });

            // get saved structure item
            //socket.join(data.id_block);
            // sending to sender client
            socket.emit('get-struct message', data);
        });
    });

    http.listen(port, function () {
        console.log('Express and socket.io listening on port ' + port);
    });
}