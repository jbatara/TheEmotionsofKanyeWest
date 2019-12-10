require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function generateOauthNonceToken(length) {
  let token = '';
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * 26);
    token += alphabet[index];
  }
  return token;
}


async function makeTwitterRequest(userName) {
  return new Promise(function (resolve, reject) {
    let request = new XMLHttpRequest();
    const baseUrlTwitter = 'https://api.twitter.com/1.1/search/tweets.json?';
    const query = 'q=from:' + userName;
    const resultType = 'result_type=recent';
    const count = 'count=100';
    const url = baseUrlTwitter + query + '&' + resultType + '&' + count;
    const bearerToken = process.env.twitterBearerToken;
    const authorization = 'Bearer ' + bearerToken;

    request.onload = function () {
      if (this.status === 200) {
        resolve(request.responseText);
      } else {
        reject(console.log('reject request', request));
      }
    }
    request.open("GET", url, true);
    request.setRequestHeader('authorization', authorization);
    request.send();
  });
}

async function getKanyeTweets() {
  try {
    let output = await makeTwitterRequest('kanyewest');
    return output;
  } catch (err) {
    let output = next(err);
  }
}

async function getGodTweets() {
  try {
    const response = await makeTwitterRequest('thetweetofgod');
    const output = returnTweetTexts(response);
    console.log(output);
    return output;
  } catch (err) {
    console.log('error', err);
  }
}

function returnTweetTexts(response) {
  const jsonResponse = JSON.parse(response);
  const statuses = jsonResponse.statuses;
  const tweets = [];

  if (statuses !== null) {
    statuses.forEach(status => tweets.push(status.text));
  }
  return tweets;
}


getGodTweets();