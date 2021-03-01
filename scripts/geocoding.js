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

export default reverseGeocode;