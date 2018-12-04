const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000);
// WARNING: app.listen(80) will NOT work here!

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../react-client/dist'));

let playerCount = 0;

io.on('connection', function (socket) {
  let roomNumber;
  playerCount++;

  io.emit('counts', playerCount);

  socket.on('disconnect', function () {
    playerCount--;
    io.sockets.emit('counts', playerCount);
  });

  socket.on('joinRoom', function (room) {
    roomNumber = room;
    socket.join(room);
    let socketRoomObject = io.sockets.adapter.rooms[room];
    if (socketRoomObject && socketRoomObject.length === 4) {
      // if the room is full, start a countdown
      console.log('room full')
      io.sockets.in(room).emit('countdown', 'starting countdown');

      var counter = 5;
      var WinnerCountdown = setInterval(function () {
        io.sockets.emit('countdown', counter);
        counter--
        if (counter === 0) {
          io.sockets.emit('countdown', counter);
          clearInterval(WinnerCountdown);
        }
      }, 1000);

    }
  })
});