// using npm unirest package https://github.com/Kong/unirest-nodejs

var unirest = require("unirest");


/**
 * Using JokeAPI V2 https://sv443.net/jokeapi/v2 
 */
// getRandomJoke();

module.exports = {
	getRandomJoke: () => {
		return new Promise((resolve, reject) => {
			const req = unirest("GET", "https://sv443.net/jokeapi/v2/joke/Any?idRange=0-173");
			req.query({"format": "json"})
				.then(res => resolve(res.body))
				.catch(err => reject(`You done messed up: ${err}`));
		});
	}
}