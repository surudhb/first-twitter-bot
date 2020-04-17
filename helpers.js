const unirest = require("unirest");

const postMediaChunked = (T, file_path) => {
    return new Promise((resolve, reject) => {
        T.postMediaChunked({file_path}, (err, {media_id_string}) => {
            if(!err) resolve(media_id_string);
            reject(err);
        });
    });
}

const getMedia = async (media_url) => {
    try {
        const response = await unirest.get(media_url).encoding(null);    
        return response.raw_body;
    } catch(err) {
        console.log(`Error getting image: ${err}`);
    }
}

module.exports = { postMediaChunked, getMedia }