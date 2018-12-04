import React from 'react';
import styles from '../styles/game.css'

class Game extends React.Component {
  constructor(props) {
    super(props);
    // emit 4 joined game events
  }

  render() {
    return (
      <div className={styles.wrapper}>
        This is the game
      </div>
    )
  }
}

export default Game;