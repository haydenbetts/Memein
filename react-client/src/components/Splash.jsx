import React from 'react';
import styles from '../styles/splash.css';

const Splash = (props) => (
  <div className={styles.loaderWrapper}>
    <div>Generating your memes</div>
    <div className={styles.loader}></div>
  </div >
)

export default Splash;