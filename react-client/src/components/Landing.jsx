import React from 'react';
import styles from '../styles/landing.css';

const Landing = (props) => (
  <div className={styles.buttonWrapper}>
    <button onClick={() => props.changeView('lobby')}>Random Game</button>
    <button onClick={() => props.changeView('lobby')}>Play With Friends</button>
  </div>
)

export default Landing;