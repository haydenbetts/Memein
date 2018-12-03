import React from 'react';
import styles from '../styles/lobby.css'

const Lobby = (props) => (
  <div className={styles.wrapper}>
    <div>Hi this is the lobby.</div>
    <div>There are currently {props.players.length} players waiting. </div>

    <button onClick={() => props.changeView('landing')}>Return to Landing Page</button>
  </div>
)

export default Lobby;