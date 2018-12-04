import React from 'react';
import styles from '../styles/scores.css';

const Scores = (props) => (
  <div className={styles.wrapper}>
    {Object.keys(props.scores).map((key) => {
      return (
        <div>
          <h2> {props['scores'][key]} Votes</h2>
          <img src={key} height="300"></img>
        </div>
      )
    })}
  </div >
)

export default Scores;