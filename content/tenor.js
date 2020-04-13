// using npm unirest package https://github.com/Kong/unirest-nodejs

const unirest = require("unirest");
const config = require('../config');

/**
 * Using Tenor's gif api https://api.tenor.com/v1/search?<parameters>
 */

const generateQuery = (word) => {
    const req = unirest("GET", `https://api.tenor.com/v1/search`);
    req.query({"key": config.tenor.api_key, "q": word});
    return req;
}

 module.exports = {
     getAssociatedGif(wotd) {
        return new Promise((resolve, reject) => {
            generateQuery(wotd).then(res => {
                console.log(`Word is: ${wotd}`);
                const results = res.body.results;
                if(results.length < 5) {
                    const substitute = Math.random() > 0.5 ? "teletubbies" : "spongebob";
                    generateQuery(substitute).then(res => {
                        const results = res.body.results;
                        const media_urls = results[Math.floor(Math.random()*results.length)]["media"][0];
                        const mobile_gif_url = media_urls["gif"]["url"];
                        resolve(mobile_gif_url);
                        })
                        .catch(err => reject(err));
                } else {
                    const media_urls = results[Math.floor(Math.random()*results.length)]["media"][0];
                    const mobile_gif_url = media_urls["gif"]["url"];
                    resolve(mobile_gif_url);
                }
                })
                .catch(err => reject(err));
        });
     }
 }