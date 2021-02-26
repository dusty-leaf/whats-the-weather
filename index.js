import config from './scripts/config.js';
import { animateWeatherGFX, animateSky }from './scripts/animations.js';
import { displayWeather, displayTemperature, displayLocation, displayClock } from './scripts/displayUI.js';
import { updateLS, getLS } from './scripts/LS.js';
import searchBar from './scripts/searchBar.js';
import getLocation from './scripts/location.js';

const getWeather = (lat, lon) => {
    //const query = getLS('zip') ? `zip=${getLS('zip')}` : `q=${getLS('city')},${getLS('country')}`;
    // https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.API_KEY}&units=imperial
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.API_KEY}&units=imperial`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            displayLocation(`${data.name.charAt(0)}${data.name.slice(1).toLowerCase()}`);
            const weather = data.weather[0].main;
            updateLS('weather', weather);
            displayWeather(data.weather[0].icon, weather);
            displayTemperature(Math.round(data.main.temp), Math.round(data.main.feels_like), Math.round(data.main.temp_max), Math.round(data.main.temp_min));
            animateSky(weather, data.sys.sunrise, data.sys.sunset, data.coord.lat, data.coord.lon);
            animateWeatherGFX(weather, data.weather[0].id);
        })
        .catch(error => {
            console.error(error);
            animateSky("default");
        });
}

const trackWeather = (lat, lon) => {
    setInterval(() => {
        getWeather(lat, lon);
    }, 60000);
    
}

const setup = async () => {
    getLocation()
    .then((data) => {
        const coords = data;
        return coords;
    })
    .then((coords) => {
        getWeather(coords.lat, coords.lon);
        trackWeather(coords.lat, coords.lon);
    });
}


setup();
displayClock();


/* const uiSearchSubmit = document.getElementById('search-submit');
uiSearchSubmit.addEventListener('click', () => {
    searchBar();
    getWeather();
});
 */
