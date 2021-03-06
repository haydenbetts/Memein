import React from 'react';
import styles from '../styles/captioning.css'
import axios from 'axios';
import LazyLoad from 'react-lazyload';

class Captioning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sampleImageUrls: [],
      blankImageUrl: "",
      topLine: "test+top+line",
      bottomLine: "test+bottom+line",
      memeIdForPost: "",
    };
  }

  componentDidMount() {
    this.fetchMeme();
  }

  componentWillReceiveProps() {
    if (this.props.countdownTwo === 1) {
      this.props.postMeme(this.state.topLine,
        this.state.bottomLine,
        this.state.memeIdForPost)
    }
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
    buttonNode.style.visibility = 'hidden';
  }

  fetchMeme() {
    this.setState({ memeIdForPost: 61532 });
    const URL = `http://version1.api.memegenerator.net//Instances_Select_ByPopular?languageCode=en&pageIndex=0&urlName=The-Most-Interesting-Man-In-The-World&days=&apiKey=${process.env.API_KEY}`;
    const BLANK_URL = `https://i.imgflip.com/1bh8.jpg`;
    this.setState({ blankImageUrl: BLANK_URL })
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

    let inputStyle = {
      marginBottom: '15px'
    }

    return (
      <div>
        <div className={styles.textWrapper}>
          <h2>Ready... set... caption....! {this.props.countdownTwo} seconds left.</h2>
          <h3>(Don't know the format? See example memes to the right and left.)</h3>
          <button id="submit" class={styles.submit} style={inputStyle} onClick={(e) => { this.clickHandler(e) }}>Submit</button>
          <div className={styles.captionArea}>
            <textarea className={styles.topText} id="topLine" onChange={(e) => this.handleChange(e)}></textarea>
            <img src={this.state.blankImageUrl} width="300"></img>
            <textarea className={styles.bottomText} id="bottomLine" onChange={(e) => this.handleChange(e)}></textarea>
          </div>
        </div>
        <div className={styles.imageWrapper}>
          {this.state.sampleImageUrls.map((url) => {
            return <LazyLoad width={290}><img src={url} width="290"></img></LazyLoad>
          })}
        </div>
      </div>
    )
  }
}

export default Captioning;