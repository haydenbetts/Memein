import React from 'react';
import styles from '../styles/vote.css';

class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadyVoted: false,
    }
  }


  handleClick(e) {

    if (!this.state.alreadyVoted) {
      let clicked = e.currentTarget;
      clicked.classList.add(styles.clickedMeme);
      this.setState({ alreadyVoted: true });
    }
    //document.getElementById( 'ctl00_ContentPlaceHolder1_ctl00_ctl01_loderImg' ).src;

  }

  render() {
    return (
      <div className={styles.generatedMemesWrapper}>
        <div className={styles.imageWrapper}>
          {this.props.generatedMemeURLS.map((url) => {
            return <img className={styles.generatedMemes} onClick={(e) => this.handleClick(e)} src={url} height="300"></img>
          })}
        </div>
      </div >
    )
  }
}

export default Vote;