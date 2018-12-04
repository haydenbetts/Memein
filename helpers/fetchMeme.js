require('dotenv').config();
const axios = require('axios');


const URL = `http://version1.api.memegenerator.net//Instances_Select_ByPopular?languageCode=en&pageIndex=0&urlName=The-Most-Interesting-Man-In-The-World&days=&apiKey=${process.env.API_KEY}`;
const POST_URL = `https://api.imgflip.com/caption_image?template_id=61532&password=${process.env.PASSWORD}&text0=hellohellohello&text1=hellohellohello&username=${process.env.USERNAME}`;

async function fetchMeme() {
  const URL = `http://version1.api.memegenerator.net//Instances_Select_ByPopular?languageCode=en&pageIndex=0&urlName=The-Most-Interesting-Man-In-The-World&days=&apiKey=${process.env.API_KEY}`;
  const POST_URL = `https://api.imgflip.com/caption_image?template_id=61532&password=${process.env.PASSWORD}&text0=hellohellohello&text1=hellohellohello&username=${process.env.USERNAME}`;

  let instanceUrls = [];

  axios.get(URL)
    .then((data) => {
      generatorID = data.data.result[0].generatorID;
      for (let i = 0; i < 3; i++) {
        instanceUrls.push(data.data.result[i].instanceImageUrl);
      }
    })
}


//export default fetchMeme;