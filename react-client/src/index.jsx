import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Landing from './components/Landing.jsx';
import Lobby from './components/Lobby.jsx';
import Captioning from './components/Captioning.jsx';
import Splash from './components/Splash.jsx';
import Vote from './components/Vote.jsx';
import Scores from './components/Scores.jsx';
import styles from './styles/app.css';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'landing',
      playerCount: 0,
      lobbyCount: 0,
      roomCount: 0,
      countdown: null,
      countdownTwo: null,
      generatedMemeURL: "",
      generatedMemeURLS: null,
      scores: null
    }
    this.changeView = this.changeView.bind(this);

    let context = this;

    /*
  socket.on('counts', function (playerCount) {
    context.setState({ playerCount: playerCount }, () => {
    })
    if (playerCount === 4) {
      //socket.emit('joinRoom', context.state.roomCount);
    }
  });
  */

    socket.on('lobbyCount', function (lobbyCount) {
      context.setState({ lobbyCount: lobbyCount }, () => {
      })
      console.log(lobbyCount)
      if (lobbyCount === 4) {
        socket.emit('joinRoom', context.state.roomCount);
      }
    });

    socket.on('countdown', function (countdown) {
      context.setState({ countdown })
    })

    socket.on('countdownTwo', function (countdownTwo) {
      context.setState({ countdownTwo: countdownTwo })
    })

    socket.on('captioningOver', function () {
      context.setState({ view: 'splash' })
      // on game over, submit your top line and bottom line to 
      // the api
      // when you have retrieved responses from the api, 
      // send those memes to everyone in the room.
      // and render 
    })

    socket.on('receivedAllMemes', function ({ urls }) {
      context.setState({ generatedMemeURLS: urls }, () => {
        context.changeView('vote');
      });
    })

    socket.on('meme', function () {
      context.setState({ view: 'captioning' })
      socket.emit('update', {
        room: context.state.roomCount,
        message: 'startgame'
      })
    })

    socket.on('gameOver', function (scores) {
      context.setState({ scores: scores }, () => {
        context.setState({ view: 'scores' });
      })
    })

    this.postMeme = this.postMeme.bind(this);
  }

  componentDidMount() {
  }

  postMeme(topline, bottomline, memeIdForPost) {
    let URL = `https://api.imgflip.com/caption_image?template_id=${memeIdForPost}&password=${process.env.PASSWORD}&text0=${topline}&text1=${bottomline}&username=${process.env.USERNAME}`
    let context = this;
    axios.get(URL)
      .then((data) => {
        this.setState({ generatedMemeURL: data.data.url });
        socket.emit('update', {
          message: 'memeGenerated',
          room: context.state.roomCount,
          url: data.data.data.url
        })
      })
  }


  changeView(option) {
    this.setState({
      view: option
    })
  }

  renderView() {
    const { view } = this.state;

    if (view === 'landing') {
      return <Landing changeView={this.changeView} />
    } else if (view === 'lobby') {
      return <Lobby changeView={this.changeView}
        lobbyCount={this.state.lobbyCount}
        roomCount={this.state.roomCount}
        countdown={this.state.countdown}
        socket={socket}
      />
    } else if (view === 'captioning') {
      return <Captioning changeView={this.changeView}
        socket={this.state.socket}
        countdownTwo={this.state.countdownTwo}
        postMeme={this.postMeme}
      />
    } else if (view === 'splash') {
      return <Splash changeView={this.state.changeView} />
    } else if (view === 'vote') {
      return <Vote generatedMemeURLS={this.state.generatedMemeURLS} socket={socket} roomCount={this.state.roomCount} />
    } else if (view === 'scores') {
      return <Scores scores={this.state.scores} />
    } else {
      return <div></div>
    }
  }

  render() {
    return (
      <div>
        <div className={styles.headlineWrapper}>
          <h1 className={styles.headline}>Memein</h1>
        </div>

        <div className="main">
          {this.renderView()}
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('memein'));
