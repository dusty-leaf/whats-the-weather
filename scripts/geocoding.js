import config from './config.js';

const geocode = (location) => new Promise(
    (resolve, reject) => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${config.GOOGLE_API_KEY}`)
            .then(response => response.json())
            .then((data) => {
                resolve(data);
            })
            .catch(err => reject(err));
    }
);

const reverseGeocode =  (lat, lon, API) => new Promise(

    (resolve, reject) => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&result_type=locality&key=${API}`)
            .then(response => response.json())
            .then((data) => {
                resolve(data.results[0].address_components[0].long_name);
            })
            .catch(err => reject(err));
        }
        
);

export { geocode, reverseGeocode };