// using npm unirest package https://github.com/Kong/unirest-nodejs

var unirest = require("unirest");


/**
 * Using Word of the day API https://random-word-api.herokuapp.com/word
 */

module.exports = {
	getWordOfTheDay: () => {
        return new Promise((resolve, reject) => {
            const req = unirest("GET", "https://random-word-api.herokuapp.com/word");
            req.then(res => resolve(res.body))
                .catch(err => reject(err));
        });
    }
}