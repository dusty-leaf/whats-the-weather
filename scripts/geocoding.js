import config from './config.js';
import ErrorHandler from './ErrorHandler.js';

class Geocoding {
    static geocode(location){
        return new Promise(
            (resolve, reject) => {
                fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${config.GOOGLE_API_KEY}`)
                    .then(response => response.json())
                    .then((data) => {
                        resolve(data);
                    })
                    .catch(err => {
                        ErrorHandler.showError('Unable to reach API server. Please wait a few minutes, then refresh the page.')
                        reject(err);
                    });
            }
        )
    };
    
    static reverseGeocode(lat, lon, API){
        return new Promise(
            (resolve, reject) => {
                console.log(`${lat} - ${lon}`)
                fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&result_type=locality&key=${API}`)
                    .then(response => response.json())
                    .then((data) => {
                        console.log(data);
                        resolve(data.results[0].address_components[0].long_name);
                    })
                    .catch(err => {
                        ErrorHandler.showError('Unable to reach API server. Please wait a few minutes, then refresh the page.')
                        reject(err);
                    });
            }
        )
    };
}

export default Geocoding;