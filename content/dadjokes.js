const unirest = require('unirest');

const dadjoke_url = 'https://icanhazdadjoke.com/';

module.exports = async () => {
    const request = unirest.get(dadjoke_url);
    request.header('Accept', 'application/json');
    try {
        const response = await request;
        return response.body.joke;
    } catch(err) {
        console.error(`Error in dadjoke: ${err}`);
    }
}
