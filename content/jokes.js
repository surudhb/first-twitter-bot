// using npm unirest package https://github.com/Kong/unirest-nodejs

const unirest = require("unirest");


/**
 * Using JokeAPI V2 https://sv443.net/jokeapi/v2 
 */

module.exports = {
	getRandomJoke: () => {
		return new Promise((resolve, reject) => {
			const req = unirest("GET", "https://sv443.net/jokeapi/v2/joke/Any");
			req.query({"format": "json"})
				.then(res => {
					const data = res.body;
					if(data.type === "twopart") {
						resolve(`${data.setup} \n\n ${data.delivery}`);
					} else {
						resolve(data.joke);
					}
				})
				.catch(err => reject(`Error retrieving joke: ${err}`));
		});
	}
}