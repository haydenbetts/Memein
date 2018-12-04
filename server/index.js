const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fetchMeme = require('../helpers/fetchMeme');

server.listen(5000);
// WARNING: app.listen(80) will NOT work here!

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../react-client/dist'));

let playerCount = 0;
const startedGameForRoom = {};
startedGameForRoom[0] = {};
startedGameForRoom[0]['lobbyCount'] = 0;


io.on('connection', function (socket) {
  // todo. Do no hard code this...
  let roomNumber = 0;
  playerCount++;
  let socketRoomObject;

  io.emit('counts', playerCount);
  io.emit('lobbyCount', startedGameForRoom[roomNumber]['lobbyCount']);


  socket.on('disconnect', function () {
    let lobbyCount = startedGameForRoom[roomNumber]['lobbyCount'];
    if (lobbyCount > 0) {
      startedGameForRoom[roomNumber]['lobbyCount']--;
    }

    if (playerCount > 0) {
      playerCount--;
    }
    delete startedGameForRoom[roomNumber]['votes'];
    //startedGameForRoom[roomNumber]['lobbyCount'] = 0;
    delete startedGameForRoom[roomNumber]['memeURLS'];

    io.sockets.emit('counts', playerCount);
    io.sockets.emit('lobbyCount', startedGameForRoom[roomNumber]['lobbyCount']);
  });


  socket.on('enteredLobby', function () {
    startedGameForRoom[roomNumber]['lobbyCount'] += 1;
    io.sockets.emit('lobbyCount', startedGameForRoom[roomNumber]['lobbyCount']);
  })

  socket.on('leftLobby', function () {
    if (startedGameForRoom[roomNumber]['lobbyCount'] > 0) {
      startedGameForRoom[roomNumber]['lobbyCount'] -= 1;
    }
    io.sockets.emit('lobbyCount', startedGameForRoom[roomNumber]['lobbyCount']);
  })

  socket.on('leavingGame', function () {
    if (startedGameForRoom[roomNumber]['lobbyCount'] > 0) {
      startedGameForRoom[roomNumber]['lobbyCount'] -= 1;
    }
    delete startedGameForRoom[roomNumber]['votes'];
    //startedGameForRoom[roomNumber]['lobbyCount'] = 0;
    delete startedGameForRoom[roomNumber]['memeURLS'];
    socket.leave(roomNumber);

    io.sockets.emit('lobbyCount', startedGameForRoom[roomNumber]['lobbyCount']);
  })

  socket.on('joinRoom', function (room) {
    roomNumber = room;
    socket.join(room);
    // startedGameForRoom[room] = {};
    socketRoomObject = io.sockets.adapter.rooms[room];
    // TODO for MVP, I am making roomObject length non-precise
    // this may cause issues in the the future!
    if (socketRoomObject && socketRoomObject.length >= 4) {
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
          io.sockets.in(room).emit('countdown', null);
        }
      }, 1000);
    }
  })

  socket.on('update', function (data) {
    if (data.message === 'enteredLobby') {

    } else if (data.message === 'startgame') {
      if (!startedGameForRoom[data.room]['timerTwo']) {
        console.log(data)

        startedGameForRoom[data.room]['timerTwo'] = true;
        io.sockets.in(data.room).emit('countdownTwo', 30);
        let counter = 30;
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
      if (!startedGameForRoom[data.room]['memeURLS']) {
        startedGameForRoom[data.room]['memeURLS'] = [data.url];
      } else {
        startedGameForRoom[data.room]['memeURLS'].push(data.url);
      }
      console.log('roomNumberReceived', data.room)
      console.log('memeURLS lenghth', startedGameForRoom[data.room]['memeURLS'])
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
      if (totalVotes === 4) io.sockets.in(data.room).emit('gameOver', startedGameForRoom[data.room]['votes']);
    }
  })

});