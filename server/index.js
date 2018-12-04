const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fetchMeme = require('../helpers/fetchMeme');

server.listen(3000);
// WARNING: app.listen(80) will NOT work here!

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../react-client/dist'));

let playerCount = 0;
const startedGameForRoom = {};

io.on('connection', function (socket) {
  // todo. Do no hard code this...
  let roomNumber = 0;
  playerCount++;
  let socketRoomObject;

  io.emit('counts', playerCount);

  socket.on('disconnect', function () {
    playerCount--;
    io.sockets.emit('counts', playerCount);
  });

  socket.on('joinRoom', function (room) {
    roomNumber = room;
    socket.join(room);
    startedGameForRoom[room] = {};
    socketRoomObject = io.sockets.adapter.rooms[room];

    if (socketRoomObject && socketRoomObject.length === 4) {
      // if the room is full, start a countdown
      console.log('room full')
      io.sockets.in(room).emit('countdown', 5);

      let counter = 5;
      let WinnerCountdown = setInterval(function () {
        counter--;
        io.sockets.in(room).emit('countdown', counter);
        if (counter === 0) {
          // TODO get three random images of the same meme,
          // and set them in the object below to our clients
          io.sockets.in(room).emit('meme', {});
          clearInterval(WinnerCountdown);
        }
      }, 1000);
    }
  })

  socket.on('update', function (data) {
    if (data.message === 'startgame') {
      if (!startedGameForRoom[data.room]['timerTwo']) {
        console.log(data)

        startedGameForRoom[data.room]['timerTwo'] = true;
        io.sockets.in(data.room).emit('countdownTwo', 5);
        let counter = 5;
        let WinnerCountdown = setInterval(function () {
          counter--
          io.sockets.in(data.room).emit('countdownTwo', counter);
          if (counter === 0) {
            io.sockets.in(data.room).emit('captioningOver');
            clearInterval(WinnerCountdown);
            delete startedGameForRoom[data.room]['timerTwo'];
          }
        }, 1000);
      }
    } else if (data.message === 'memeGenerated') {
      console.log(data)
      if (!startedGameForRoom[data.room]['memeURLS']) {
        startedGameForRoom[data.room]['memeURLS'] = [data.url];
      } else {
        startedGameForRoom[data.room]['memeURLS'].push(data.url);
      }

      if (startedGameForRoom[data.room]['memeURLS'].length === 4) {
        io.sockets.in(data.room).emit('receivedAllMemes', {
          urls: startedGameForRoom[data.room]['memeURLS']
        });

        // can comment this out
        startedGameForRoom[data.room]['votes'] = {};
        Object.values(startedGameForRoom[data.room]['memeURLS']).forEach((url) => {
          startedGameForRoom[data.room]['votes'][url] = 0;
        })
      }
    } else if (data.message === 'voted') {
      console.log(startedGameForRoom[data.room]['votes'])
      //

      startedGameForRoom[data.room]['votes'][data.voteURL] += 1;


      /*
      if (!startedGameForRoom[data.room]['votes']) {
        startedGameForRoom[data.room]['votes'] = {};
        startedGameForRoom[data.room]['votes'][data.voteURL] = 1;
      } else {
        if (startedGameForRoom[data.room]['votes'][data.voteURL]) {
          startedGameForRoom[data.room]['votes'][data.voteURL] += 1;
        } else {
          startedGameForRoom[data.room]['votes'][data.voteURL] = 1;
        }
      }
      */

      // if total number of votes === 4, emit gameover
      let totalVotes = Object.values(startedGameForRoom[data.room]['votes']).reduce((acc, elt) => acc + elt);
      console.log('totalvotes', totalVotes)
      if (totalVotes === 4) io.sockets.in(data.room).emit('gameOver', startedGameForRoom[data.room]['votes']);
    }
  })

});