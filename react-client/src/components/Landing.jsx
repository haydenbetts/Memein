import React from 'react';
import styles from '../styles/landing.css';

const Landing = (props) => (
  <div className={styles.buttonWrapper}>
    <h3>Caption memes with friends.</h3>
    <h3>Vote on the best captions.</h3>
    <button onClick={() => props.changeView('lobby')}>Enter Lobby</button>
  </div>
)

export default Landing;