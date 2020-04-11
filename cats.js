// https://cataas.com/#/cats

// Responsible for tweeting the word of the day using https://random-word-api.herokuapp.com/word

// using npm unirest package https://github.com/Kong/unirest-nodejs
var unirest = require('unirest');

module.exports = {
    getCatOfTheDay(wotd, get_gif = true) {
        return new Promise((resolve, reject) => {
            const url = `https://cataas.com/cat${get_gif ? '/gif' : ''}/says/${wotd}`;
            const req = unirest("GET", url);
            req.query({"format": "json"})
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    }
}

