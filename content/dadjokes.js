// using npm unirest package https://github.com/Kong/unirest-nodejs
const unirest = require('unirest');

module.exports = {
    getDadJoke() {
        return new Promise((resolve, reject) => {
            const req = unirest("GET", 'https://icanhazdadjoke.com/');
            req.query({"format": "json"})
                .headers({'Accept': 'application/json'})
                .then(res => resolve(res.body.joke))
                .catch(err => reject(`Error retrieving dad joke: ${err}`));
        });
    }
}
