import React from 'react';
import styles from '../styles/lobby.css'

class Lobby extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    // if (this.props.countdown === 0) {
    //   this.props.changeView('game');
    // }
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div>Hi this is lobby {this.props.roomCount}.</div>
        <div>There are currently {this.props.players} players waiting. </div>
        {
          this.props.countdown &&
          <div>
            Starting game in {this.props.countdown}.
      </div>
        }
        <button onClick={() => this.props.changeView('landing')}>Return to Landing Page</button>
      </div>
    )
  }
}

export default Lobby;