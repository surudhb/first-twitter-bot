// using npm unirest package https://github.com/Kong/unirest-nodejs// https://cataas.com/#/cats

// Responsible for tweeting the word of the day using https://random-word-api.herokuapp.com/word

// using npm unirest package https://github.com/Kong/unirest-nodejs
var unirest = require('unirest');

module.exports = {
    getDadJoke() {
        return new Promise((resolve, reject) => {
            const req = unirest("GET", 'https://icanhazdadjoke.com/');
            req.query({"format": "json"})
                .headers({'Accept': 'application/json'})
                .then(res => resolve(res.body.joke))
                .catch(err => reject(`You done messed up: ${err}`));
        });
    }
}



