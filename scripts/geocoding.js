import config from './config.js';
import { showError } from './errorHandler.js';

const geocode = (location) => new Promise(
    (resolve, reject) => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${config.GOOGLE_API_KEY}`)
            .then(response => response.json())
            .then((data) => {
                resolve(data);
            })
            .catch(err => {
                showError('Unable to reach API server. Please wait a few minutes, then refresh the page.')
                reject(err);
            });
    }
);

const reverseGeocode = (lat, lon, API) => new Promise(

    (resolve, reject) => {
        console.log(`${lat} - ${lon}`)
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&result_type=locality&key=${API}`)
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                resolve(data.results[0].address_components[0].long_name);
            })
            .catch(err => {
                showError('Unable to reach API server. Please wait a few minutes, then refresh the page.')
                reject(err);
            });
    }
);

export { geocode, reverseGeocode };