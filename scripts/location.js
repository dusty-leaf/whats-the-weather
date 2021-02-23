const getLocation = () => {
    navigator.geolocation.getCurrentPosition();
    return {lat: position.coords.latitude, lon: position.coords.longitude}
}

export default getLocation;
