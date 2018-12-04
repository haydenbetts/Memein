import React from 'react';
import styles from '../styles/game.css'
import axios from 'axios';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sampleImageUrls: [],
      topLine: "",
      bottomLine: ""
    };
  }

  componentDidMount() {
    this.fetchMeme();
  }

  handleChange(e) {
    const eltId = e.target.id;
    const eltValue = e.target.value;
    this.setState({ [eltId]: eltValue }, () => {

    })
  };

  clickHandler(e) {
    // remove submit button
    let buttonNode = document.querySelector('#submit');
    document.querySelector('#topLine').disabled = true;
    document.querySelector('#bottomLine').disabled = true;
    buttonNode.style.display = 'none';
  }

  fetchMeme() {
    const URL = `http://version1.api.memegenerator.net//Instances_Select_ByPopular?languageCode=en&pageIndex=0&urlName=The-Most-Interesting-Man-In-The-World&days=&apiKey=${process.env.API_KEY}`;
    const POST_URL = `https://api.imgflip.com/caption_image?template_id=61532&password=${process.env.PASSWORD}&text0=hellohellohello&text1=hellohellohello&username=${process.env.USERNAME}`;
    let instanceUrls = [];
    let context = this;
    axios.get(URL)
      .then((data) => {
        //generatorID = data.data.result[0].generatorID;
        for (let i = 0; i < 3; i++) {
          instanceUrls.push(data.data.result[i].instanceImageUrl);
          context.setState({ sampleImageUrls: instanceUrls });
        }
      })
  }

  render() {
    return (
      <div>
        <div className={styles.imageWrapper}>
          {this.state.sampleImageUrls.map((url) => {
            return <img src={url} height="300"></img>
          })}
        </div>
        <div className={styles.textWrapper}>
          <h3> My Top-line</h3>
          <input id="topLine" onChange={(e) => this.handleChange(e)}></input>
          <h3> My Bottom-line</h3>
          <input id="bottomLine" onChange={(e) => this.handleChange(e)}></input>
          <button id="submit" onClick={(e) => { this.clickHandler(e) }}>Submit</button>
          There are {this.props.countdownTwo} seconds left.
        </div>
      </div>
    )
  }
}

export default Game;