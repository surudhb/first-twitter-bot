const unirest = require("unirest");

/**
 * Using Word of the day API https://random-word-api.herokuapp.com/word
 */

 const word_url = "https://random-word-api.herokuapp.com/word";

module.exports = async () => {
    const request = unirest.get(word_url);
    request.header('Accept', 'application/json');
    try {
        const response = await request;
        return response.body;
    } catch(err) {
        console.error(`Error in word: ${err}`);
    }
}