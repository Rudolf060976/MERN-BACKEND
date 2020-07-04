const axios = require('axios');
const createError = require('http-errors');

const API_KEY = 'AIzaSyBfyRWEXT4A80gK49DMl7_ZfRbjkDB_yVw';


async function getCoordsForAddress(address) {

    try {

        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);

    
        if(!response.data || response.data.status==='ZERO_RESULTS') {
    
            throw createError(404, 'ADDRESS NOT FOUND');
    
        }

        const coordinates = response.data.results[0].geometry.location;

        return coordinates;


    } catch (error) {
     
        throw createError(error.status || 500, error.message);

    }

}


module.exports = getCoordsForAddress;