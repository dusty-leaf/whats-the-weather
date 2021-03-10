import config from './scripts/config.js';
import { animateWeatherGFX, animateSky }from './scripts/animations.js';
import { displayWeather, displayTemperature, displayForecast, displayLocation, displayDate, displayClock } from './scripts/displayUI.js';
import { setLS, getLS } from './scripts/LS.js';
import getLocation from './scripts/location.js';
import reverseGeocode from './scripts/geocoding.js';
import autocompleteSearchBar from './scripts/autocompleteSearchBar.js';
import controls from './scripts/controls.js';

const updateLS = (data) => {
    const current = data.current;
    const today = data.daily[0];

    setLS([
        { key: 'current', value: current.temp },
        { key: 'feelslike', value: current.feels_like },
        { key: 'max', value: today.temp.max },
        { key: 'min', value: today.temp.min },
        { key: 'forecast', value: JSON.stringify(data.daily)}
    ]);

}

const updateDOM = (data) => {
    const weather = data.current.weather[0].main;
    const current = data.current;
    const today = data.daily[0];
    setLS([{ key: 'weather', value: weather }]);
    displayWeather(current.weather[0].id, weather);
    displayTemperature(current.temp, current.feels_like, today.temp.max, today.temp.min);
    displayForecast(data.daily);
    animateSky(weather, today.sunrise, today.sunset, location.lat, location.lon);
    animateWeatherGFX(weather, weather.id);
}

const getWeather = (lat, lon, unit) => new Promise(
    (resolve, reject) => {
    //const query = getLS('zip') ? `zip=${getLS('zip')}` : `q=${getLS('city')},${getLS('country')}`;
    // https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.API_KEY}&units=imperial
    // https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.API_KEY}&units=imperial
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${config.OPENWEATHER_API_KEY}&units=${unit}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            resolve(data);
        })
        .catch(error => {
            animateSky("default");
            reject(error);
        });
});

let keepDataUpdated;

const trackWeather = (lat, lon, unit) => {
    keepDataUpdated = setInterval(() => {
        getWeather(lat, lon, unit)
        .then((data) => {
            updateLS(data);
            updateDOM(data);
        });
    }, 60000);
    
}



const setup = async () => {
    const units = 'imperial';
    const location = {};
    await getLocation()
    .then((data) => {
        location.lat = data.lat;
        location.lon = data.lon;
        console.log(location);
        return location;
    })
    .then(async (location) => {
        await reverseGeocode(location.lat, location.lon, config.GOOGLE_API_KEY)
        .then(value => location.name = value);
        return location;
    })
    .then(async (location) => {
        displayLocation(location.name);
        await getWeather(location.lat, location.lon, units)
        .then((data) => {
            updateDOM(data);
            updateLS(data);
            if(keepDataUpdated){ keepDataUpdated.clearInterval(); };
            trackWeather(location.lat, location.lon, units);
        })   
    })
    .catch((err) => {
        console.error(err);
    });

}

const googleapis = document.getElementById('googleapis');
googleapis.src = `https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_API_KEY}&libraries=places`
googleapis.addEventListener('load', () => {
    autocompleteSearchBar();
});

setLS([{key: 'unit', value: 'imperial'}]);

setup();
displayDate();
displayClock();
controls();

