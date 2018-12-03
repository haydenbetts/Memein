import React from 'react';
import styles from '../styles/lobby.css'

const Lobby = (props) => (
  <div className={styles.wrapper}>
    <div>Hi this is lobby {props.roomCount}.</div>
    <div>There are currently {props.players} players waiting. </div>

    <button onClick={() => props.changeView('landing')}>Return to Landing Page</button>
  </div>
)

export default Lobby;