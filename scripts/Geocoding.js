'use strict';

class Geocoding {
    static geocode(location){
        return new Promise(
            (resolve, reject) => {
                fetch(`https://radiant-lowlands-59230.herokuapp.com/geocode?address=${location}`)
                    .then(response => response.json())
                    .then((data) => {
                        resolve(data);
                    })
                    .catch(err => {
                        reject(err)
                    });
            }
        )
    };
    
    static reverseGeocode(lat, lon, API){
        return new Promise(
            (resolve, reject) => {
                fetch(`https://radiant-lowlands-59230.herokuapp.com/reversegeocode?lat=${lat}&lon=${lon}`)
                    .then(response => response.json())
                    .then((data) => {
                        console.log(data);
                        resolve(data.json.results[0].address_components[0].long_name);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
        )
    };
}

export default Geocoding;