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
    for(let i = 0; i< kwQuotes.length; i++){
        let response = await kwQuotes[i];
        let object = JSON.parse(response);
        let quote = object.quote;
        kwString += " "+quote; 
    }
        return kwString;

    // fs.writeFile('kanyeQuotes.txt', kwString, (err) => {
    //     if (err) throw err;
    // })


}

