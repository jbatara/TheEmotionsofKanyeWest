
const fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function makeKanyeRequest() {
    return new Promise(function (res, rej) {
        let request = new XMLHttpRequest();
        let urlKanye = 'https://api.kanye.rest';
        request.onload = function () {
            if (this.status === 200) {
                res(request.responseText);
            } else {
                rej(Error(request.statusText));
            }
        }
        request.open("GET", urlKanye, true);
        request.send();
    });
}

async function kanye() {
    let kwQuotePromises = [];
    for (let i = 0; i < 50; i++) {
        kwQuotePromises.push(makeKanyeRequest());
    }

    let kwQuotes = await kwQuotePromises;

    let kwString = '';
    for (let i = 0; i < kwQuotes.length; i++) {
        let response = await kwQuotes[i];
        let object = JSON.parse(response);
        let quote = object.quote;
        kwString += " " + quote;
    }
    return await kwString;

    // fs.writeFile('kanyeQuotes.txt', kwString, (err) => {
    //     if (err) throw err;
    // })


}

require('dotenv').config();
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');




const toneAnalyzer = new ToneAnalyzerV3({
    authenticator: new IamAuthenticator({
        apikey: process.env.watsonKey,
    }),
    version: process.env.watsonVersion,
    url: process.env.watsonURL,
});

async function watsonRequest() {
    const text = 'Happyness is the greatest to spread through love. Happyness is the greatest to spread through love.  Hamsters are not all idiots.';
    const text2 = 'Raclette hoodie gluten-free, asymmetrical sriracha waistcoat bespoke 3 wolf moon kombucha. Leggings migas snackwave four dollar toast post-ironic, tacos copper mug. Sustainable single-origin coffee flexitarian deep v. Kitsch affogato vexillologist gastropub PBR&B quinoa. Kale chips gentrify chambray keytar. Lumbersexual chicharrones direct trade try-hard, pork belly kale chips cred vice master cleanse sartorial portland YOLO mixtape twee.';
    const text3 = 'It’s a personal policy of mine to never use my platform to attack, disparage, or harm any black person not in a position of power. There is enough racism, racists, bigotry, and prejudice in this world that it will never be my place.';
    const K = await kanye();
    let params = {
        toneInput: { 'text': K },
        content_type: 'text/plain',
    };
    toneAnalyzer.tone(params)
        .then(toneAnalysis => {
            kwString = JSON.stringify(toneAnalysis, null, 2);
            fs.writeFile('kanyeQuotesResponse.json', kwString, (err) => {
                if (err) throw err;
            });
        })
        .catch(err => {
            console.log('error:', err);
        });
}

watsonRequest();

