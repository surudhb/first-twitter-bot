const Twit = require('twit');
const fs = require('fs');
const path = require('path');
const unirest = require("unirest");

const config = require('./config');

const hazdadjokes = require('./content/dadjokes');
const jokes = require('./content/jokes.js');
const wotd = require('./content/wotd');
const tenor = require('./content/tenor');

const T = new Twit(config.twit);

const HOUR_INTERVAL = 12;

const DEBUG = process.env.DEBUG || false;

/**
 * Promise implementation since nodejs is still 'experimental' with async/await
 */

function init() {
    if(!DEBUG) {
        console.log = () => {};
        console.error = () => {};
    }
    // TODO: setIntervals for tweets
}

function tweetWOTDHelper(media_url, word) {
    unirest('GET', media_url).encoding(null).then(res => {
        const data = Buffer.from(res.raw_body, 'base64');
        fs.writeFileSync('./tmp/post.gif', data, 'base64'); // create temporary file
        const file_path = path.join(__dirname, 'tmp', 'post.gif');
        console.log(`successfully retrieved raw gif`);
        // the following method doesn't support promises, so we're back to traditional callbacks
         T.postMediaChunked({"file_path": file_path}, (err, data) => {
            if(!err) {
                const id = data.media_id_string;
                tweetContent({ "status": `Gary's word of the day is: ${word}`, "media_ids": [id]});
                fs.unlinkSync(file_path);
            } else { console.error(`Error uploading media chunk: ${err}`); }
         });
        })
        .catch(err => console.error(`Error posting word of the day: ${err}`));
}

function tweetWOTD() {
    wotd.getWordOfTheDay()
    .then(word => tenor.getAssociatedGif(word)
    .then(media_url => {
        console.log('received media url');
        tweetWOTDHelper(media_url, word);
    })
    .catch(err => console.error(`Calling WOTD Error: ${err}`)));
}

function tweetDadJoke() {
    hazdadjokes.getDadJoke()
        .catch(err => console.error(`Dad joke Error: ${err}`))
        .then(joke => tweetContent({"status": joke}));
}

function tweetJoke() {
    jokes.getRandomJoke()
        .catch(err => console.error(`Tweet normal joke error: ${err}`))
        .then(joke => tweetContent({"status": joke}));
}

// content : { "status": `text being tweeted` }
function tweetContent(content) {
    T.post('statuses/update', content)
        .catch(err => console.log(`You done messed up: ${err}`))
        .then(({resp}) => console.log(`It worked! ${resp.statusCode}`));
}


init();