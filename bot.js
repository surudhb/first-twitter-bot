const Twit = require('twit');
const config = require('./config');

const cataas = require('./content/cats');
const hazdadjokes = require('./content/dadjokes');
const jokes = require('./content/jokes.js');
const wotd = require('./content/wotd');

const T = new Twit(config.twit);

const HOUR_INTERVAL = 2;

/**
 * Promise implementation
 */

//  TODO: not sure what cataas returns as part of its response, GIPHY's developer site has an error so cant get an API key smh
function tweetCatWOTD() {
    wotd.getWordOfTheDay()
    .then(word => cataas.getCatOfTheDay(word)
    .then(res => console.log(Object.keys(res)))
    .catch(err => console.log(`Error: ${err}`)));
}


function tweetDadJoke() {
    hazdadjokes.getDadJoke()
        .catch(err => console.log(err))
        .then((joke) => tweetText({"status": joke}));
}

function tweetJoke() {
    jokes.getRandomJoke()
        .catch(err => console.log(err))
        .then((joke) => tweetText({"status": joke}));
}


// content : { status: `text being tweeted` }
function tweetText(content) {
    T.post('statuses/update', content)
        .catch((err) => {
            console.log(`You done messed up: ${err}`);
        })
        .then(({resp}) => {
            console.log(`It worked! ${resp.statusCode}`);
        });
}

tweetDadJoke();
setInterval(tweetDadJoke, 1000*60*60*HOUR_INTERVAL);

setTimeout(() => {
    setInterval(tweetJoke, 1000*60*60*HOUR_INTERVAL);
}, 1000*60*60);

