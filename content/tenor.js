const unirest = require("unirest");
const config = require('../config');

const SUBSTITUTES = ['teletubbies', 'spongebob', 'trump', 'cats', 'fish', 'volcano', 'avatar', 'matrix', 'star wars'];

/**
 * Using Tenor's gif api https://api.tenor.com/v1/search?<parameters>
 */

const generateQuery = (word) => {
    const req = unirest("GET", `https://api.tenor.com/v1/search`);
    req.query({"key": config.tenor.api_key, "q": word});
    return req;
}

 const getAssociatedGif = async (word) => {
    const request = generateQuery(word);
    try {
        const response = await request;
        let results = response.body.results;
        if(results.length < 3) {
            const substitute = SUBSTITUTES[Math.floor(Math.random() * SUBSTITUTES.length)];
            const sub_request = generateQuery(substitute);
            const sub_response = await sub_request;
            results = sub_response.body.results;
        }
        const random_gif = results[Math.floor(Math.random() * results.length)]["media"][0];
        return random_gif["gif"]["url"];
    } catch(err) {
        console.error(`Error in tenor: ${err}`);
    }
 };

 module.exports = getAssociatedGif;