import config from './scripts/config.js';
import { animateWeatherGFX, animateSky }from './scripts/animations.js';
import { displayWeather, displayTemperature, displayLocation, displayClock } from './scripts/displayUI.js';
import { updateLS, getLS } from './scripts/LS.js';

const getWeather = () => {
    const query = getLS('zip') ? `zip=${getLS('zip')},${getLS('country')}` : `q=${getLS('city')},${getLS('country')}`;
    fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${config.API_KEY}&units=imperial`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            displayLocation(getLS('city'));
            const weather = data.weather[0].main;
            updateLS('weather', weather);
            displayWeather(data.weather[0].icon, weather);
            displayTemperature(Math.round(data.main.temp), Math.round(data.main.feels_like), Math.round(data.main.temp_max), Math.round(data.main.temp_min));
            animateSky(weather, data.sys.sunrise, data.sys.sunset, data.coord.lat, data.coord.lon);
            animateWeatherGFX(weather, data.weather[0].id);
        })
        .catch(error => {
            console.error(error);
            displayBackground("default");
        });
}

const trackWeather = () => {
    setInterval(() => {
        getWeather();
    }, 60000);
    
}

displayClock();
getWeather();
trackWeather();


