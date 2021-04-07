import config from './scripts/config.js';
import { animateWeatherGFX, animateSky, clearParticles, toggleParticleAnimations }from './scripts/animations.js';
import { displayWeather, displayTemperature, displayForecast, displayLocation, displayDate, displayClock } from './scripts/displayUI.js';
import { setLS, getLS } from './scripts/LS.js';
import getLocation from './scripts/location.js';
import { geocode, reverseGeocode } from './scripts/geocoding.js';
import autocompleteSearchBar from './scripts/autocompleteSearchBar.js';
import { toggleDisplayUnits, toggleLoader, toggleHidden, toggleIsPaused, toggleAppPause, toggleLoaderWithBuffer } from './scripts/controls.js';
import { showError, clearError } from './scripts/errorHandler.js';
import { getWeather, updateWeather } from "./scripts/weather.js";
import { isDay } from './scripts/utilities.js';
import menu from './scripts/menu.js';

const state = {
    setProperty: function(key, val){
        state[key] = val;
    },
    setMultipleProperties: function(arr){
        arr.forEach((el) => {
            state[el[0]] = el[1];
        })
    }
};

state.setMultipleProperties([
    ['isPaused', false],
    ['refreshData', ''],
    ['timeRemainingInCycle', 60000],
    ['updateTimeRemainingInCycle', '']
]);

const updateDOM = (state) => {
    const weather = state.toggledWeather ? state.toggledWeather : state.weather;
    displayClock(state.tz);
    displayDate(state.tz);
    displayWeather(state.current.weather[0].id, state.weather, state.tz);
    displayTemperature(state.current.temp, state.current.feels_like, state.today.temp.max, state.today.temp.min);
    displayForecast(state.forecast);
    animateSky(weather, state.today.sunrise, state.today.sunset, state.lat, state.lon);
    animateWeatherGFX(weather, state.weather.id, state.tz);
}

const updateAll = async (state) => {
    await getWeather(state)
    .then((data) => {
        state.setMultipleProperties([
            ['weather', data.current.weather[0].main],
            ['current', data.current],
            ['today', data.daily[0]],
            ['tz', data.timezone],
            ['forecast', data.daily]
        ]);
        
        updateDOM(state);
        if(state.refreshData !== undefined){ clearTimeout(state.refreshData); };
        updateWeather(state);
        settingsBtn.disabled = false;
    })
    .catch((err) => {
        console.error(err);
    });
};

const updateLocation = async (location) => {
    toggleLoader(true);
    clearError();
    await geocode(location)
    .then(data => {
        console.log(data);
        state.setMultipleProperties([
            ['lat', data.results[0].geometry.location.lat],
            ['lon', data.results[0].geometry.location.lng]
        ]);
    })
    .then(async () => {
        updateAll();
        toggleLoaderWithBuffer();
    })
    .catch((err) => {
        console.error(err);
    });  
}

const setup = async () => {
    await getLocation()
    .then((data) => {
        console.log(data);
        state.setMultipleProperties([
            ['lat', data.lat],
            ['lon', data.lon]
        ]);
    })
    .then(async () => {
        await reverseGeocode(state.lat, state.lon, config.GOOGLE_API_KEY)
        .then(value => state.location = value);
        return location;
    })
    .then(async () => {
        displayLocation(state.location);
        updateAll(state);
        toggleLoaderWithBuffer();
    })
    .catch((err) => {
        console.error(err);
    });

}

const searchInput = document.getElementById('search');
const searchSubmit = document.getElementById('search-submit');
searchSubmit.addEventListener('click', () => {
    const regex = /\s|,\s/g;
    displayLocation(searchInput.value.slice(0, searchInput.value.indexOf(',')));
    const newLocation = searchInput.value.replaceAll(regex, '+');
    updateLocation(newLocation);
});

const settingsBtn = document.getElementById('settings');
settingsBtn.disabled = true;

settingsBtn.addEventListener('click', () => {
    toggleAppPause(state);
});

toggleLoader();
toggleDisplayUnits();
setup();
menu(state);

export default state;