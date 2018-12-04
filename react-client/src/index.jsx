import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import Landing from './components/Landing.jsx';
import Lobby from './components/Lobby.jsx';
import Game from './components/Game.jsx';
import styles from './styles/app.css';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'lobby',
      players: [],
      playerCount: 0,
      roomCount: 0,
      countdown: null
    }
    this.changeView = this.changeView.bind(this);

    let context = this;
    socket.on('counts', function (playerCount) {
      context.setState({ playerCount: playerCount }, () => {
      })
      if (playerCount === 4) {
        socket.emit('joinRoom', context.state.roomCount);
      }
    });

    socket.on('countdown', function (countdown) {
      context.setState({ countdown })
    })
  }

  componentDidMount() {
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
        players={this.state.playerCount}
        roomCount={this.state.roomCount}
        countdown={this.state.countdown}
      />
    } else if (view === 'game') {
      return <Game changeView={this.changeView} />
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
