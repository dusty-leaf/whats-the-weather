const getLocation = () => new Promise(
    (resolve, reject) => {

        const success = (position) => {
            resolve({ lat: position.coords.latitude, lon: position.coords.longitude });
        }
        
        const error = (err) => {
            reject(err);
        }

        if(!navigator.geolocation){
            alert('Geolocation is not supported by your browser.');
        } else {
            const allow = document.getElementById('allow');
            allow.addEventListener('click', () => {
                window.navigator.geolocation.getCurrentPosition(success, error);
            });
        }
      
    }
  );

export default getLocation;
