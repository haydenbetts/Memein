import React from 'react';
import styles from '../styles/vote.css';

const Vote = (props) => (
  <div className={styles.generatedMemesWrapper}>
    <div className={styles.imageWrapper}>
      {props.generatedMemeURLS.map((url) => {
        return <img src={url} height="300"></img>
      })}
    </div>
  </div >
)

export default Vote;