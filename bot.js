const Twit = require('twit');
const fs = require('fs');
const path = require('path');
const { CronJob } = require('cron');

const config = require('./config');

const getDadJoke = require('./content/dadjokes');
const getRandomJoke = require('./content/jokes');
const getWordOfTheDay = require('./content/wotd');
const getAssociatedGif = require('./content/tenor');
const helpers = require('./helpers');

const T = new Twit(config.twit);

const DEBUG = process.env.DEBUG || false;

/**
 * Using async/await jajajaja
 */

function init() {

    if(!DEBUG) {
        console.log = () => {};
        console.error = () => {};
    }

    // Creating cron jobs for each of Gary's tweets
    const wotd_job = new CronJob('00 30 09 * * *', tweetWOTD); // 9:30 am
    const dadjoke_apha_job = new CronJob('00 00 12 * * *', tweetDadJoke); // 12:00 pm
    const dadjoke_beta_job = new CronJob('00 30 16 * * *', tweetDadJoke); // 4:30 pm
    const joke_job = new CronJob('00 00 21 * * *', tweetJoke); // 9:00 pm
    console.log(`Starting jobs...`);
    wotd_job.start();
    dadjoke_apha_job.start();
    dadjoke_beta_job.start();
    joke_job.start();
    console.log(`Jobs started.`);
}

async function tweetWOTD() {
    console.log(`Tweeting word of the day...`);
    try {
        const word = await getWordOfTheDay();
        const media_url = await getAssociatedGif(word);
        const raw_body = await helpers.getMedia(media_url);
        const img_buf = Buffer.from(raw_body, 'base64');
        const img_path = path.join(__dirname, 'tmp', 'post.gif');
        fs.writeFileSync(img_path, img_buf, 'base64'); // create temporary file
        const img_id = await helpers.postMediaChunked(T, img_path);
        tweetContent({status:`Gary's word of the day is: ${word}`, media_ids: [img_id]});
        fs.unlinkSync(img_path); // delete temporary file after img_id retrieved
    } catch(err) {
        console.error(`Error in parent word: ${err}`);
    }
}

function tweetDadJoke() {
    console.log(`Tweeting dad joke...`);
    getDadJoke()
    .then(joke => tweetContent({status: joke}))
    .catch(err => console.error(`Dad joke Error: ${err}`));
}

function tweetJoke() {
    console.log(`Tweeting joke...`);
    getRandomJoke()
    .then(joke => tweetContent({status: joke}))
    .catch(err => console.error(`Tweet normal joke error: ${err}`));
}

function tweetContent(content) {
    T.post('statuses/update', content)
    .then(({resp}) => console.log(`It worked! ${resp.statusCode}`))
    .catch(err => console.log(`You done messed up: ${err}`));
}


init();