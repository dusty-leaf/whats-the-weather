class Geocoding {
    static geocode(location){
        return new Promise(
            (resolve, reject) => {
                fetch(`https://blooming-sands-36961.herokuapp.com/geocode?address=${location}`)
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
                fetch(`https://blooming-sands-36961.herokuapp.com/reversegeocode?lat=${lat}&lon=${lon}`)
                    .then(response => response.json())
                    .then((data) => {
                        resolve(data.results[0].address_components[0].long_name);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
        )
    };
}

export default Geocoding;