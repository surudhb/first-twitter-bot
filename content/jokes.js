const unirest = require("unirest");

const jokes_url = "https://sv443.net/jokeapi/v2/joke/Any";

module.exports = async () => {
	const request = unirest.get(jokes_url);
	request.header('Accept', 'application/json');
	try {
		const response = await request;
		const data = response.body;
		return data.type === "twopart" ? `${data.setup} \n\n ${data.delivery}` : data.joke;
	} catch(err) {
		console.error(`Error in joke: ${err}`);
	}
};