const Twit = require('twit');
const fs = require('fs');
const path = require('path');
const unirest = require("unirest");
const { CronJob } = require('cron');

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

    // Creating cron jobs for each of Gary's tweets
    const wotd_job = new CronJob('00 00 09 * * *', tweetWOTD); // 9:00 am
    const dadjoke_apha_job = new CronJob('00 30 12 * * *', tweetDadJoke); // 12:30 pm
    const dadjoke_beta_job = new CronJob('00 30 20 * * *', tweetDadJoke); // 8:30 pm
    const joke_job = new CronJob('00 00 17 * * *', tweetJoke); // 5:00 pm
    console.log(`Starting jobs...`);
    wotd_job.start();
    dadjoke_apha_job.start();
    dadjoke_beta_job.start();
    joke_job.start();
    console.log(`Jobs started.`);
}

function tweetWOTDHelper(media_url, word) {
    unirest('GET', media_url).encoding(null).then(res => {
        const data = Buffer.from(res.raw_body, 'base64');
        const file_path = path.join(__dirname, 'tmp', 'post.gif');
        fs.writeFileSync(file_path, data, 'base64'); // create temporary file
        console.log(`successfully retrieved raw gif`);
        // the following method does not return a promise, so we're back to traditional callbacks
         T.postMediaChunked({"file_path": file_path}, (err, data) => {
            if(!err) {
                const id = data.media_id_string;
                tweetContent({"status": `Gary's word of the day is: ${word}`, "media_ids": [id]});
                fs.unlinkSync(file_path); // delete temporary file
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