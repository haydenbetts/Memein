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
let roomCount = 0;

io.on('connection', function (socket) {
  playerCount++;

  io.emit('counts', playerCount);

  socket.on('disconnect', function () {
    playerCount--;
    io.sockets.emit('counts', playerCount);
  });

  socket.on('room', function (room) {
    console.log(room);
    socket.join(room);
  })
});