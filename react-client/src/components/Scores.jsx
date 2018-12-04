import React from 'react';
import styles from '../styles/scores.css';
class Scores extends React.Component {

  constructor(props) {
    super(props);
  }

  handleClick() {
    console.log('here?')
    this.props.socket.emit('leavingGame');
    this.props.changeView('landing');
  }

  render() {
    return (
      <div>
        <div className={styles.wrapper}>
          {Object.keys(this.props.scores).map((key) => {
            return (
              <div>
                <h2> {this.props['scores'][key]} Votes</h2>
                <img src={key} height="300"></img>
              </div>
            )
          })}
        </div >
        <div className={styles.buttonWrapper}>
          <button onClick={() => { this.handleClick() }}>Play Again</button>
        </div>
      </div>
    )
  }
}

export default Scores;