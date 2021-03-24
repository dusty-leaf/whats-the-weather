import config from './scripts/config.js';
import { animateWeatherGFX, animateSky, clearParticles, toggleParticleAnimations }from './scripts/animations.js';
import { displayWeather, displayTemperature, displayForecast, displayLocation, displayDate, displayClock } from './scripts/displayUI.js';
import { setLS, getLS } from './scripts/LS.js';
import getLocation from './scripts/location.js';
import { geocode, reverseGeocode } from './scripts/geocoding.js';
import autocompleteSearchBar from './scripts/autocompleteSearchBar.js';
import { toggleDisplayUnits, toggleLoader, toggleHidden } from './scripts/controls.js';
import { showError, clearError } from './scripts/errorHandler.js';
import { isDay } from './scripts/utilities.js';

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

const toggleIsPaused = () => {
    if(state.isPaused){ return false; }
    return true;
}

const toggleAppPause = () => {
    const searchInput = document.getElementById('search');
    const searchSubmit = document.getElementById('search-submit');

    if(!state.isPaused){
        state.setProperty('isPaused', toggleIsPaused());
        searchInput.disabled = true;
        searchSubmit.disabled = true;
        clearTimeout(state.refreshData);
        clearInterval(state.updateTimeRemainingInCycle);
        toggleParticleAnimations();
        settingsContainer.classList.toggle('hidden');
        return;
    }

    state.setProperty('isPaused', toggleIsPaused());
    searchInput.disabled = false;
    searchSubmit.disabled = false;
    updateWeather(state.lat, state.lon, true);
    toggleParticleAnimations();
    settingsContainer.classList.toggle('hidden');
    return;
}

const updateDOM = () => {
    
    // clearParticles();
    // setLS([{ key: 'weather', value: weather }]);
    displayClock(state.tz);
    displayDate(state.tz);
    displayWeather(state.current.weather[0].id, state.weather, state.tz);
    displayTemperature(state.current.temp, state.current.feels_like, state.today.temp.max, state.today.temp.min);
    displayForecast(state.forecast);
    animateSky(state.weather, state.today.sunrise, state.today.sunset, state.lat, state.lon);
    animateWeatherGFX(state.weather, state.weather.id, state.tz);
}

const getWeather = (lat, lon, unit) => new Promise(
    (resolve, reject) => {
    //const query = getLS('zip') ? `zip=${getLS('zip')}` : `q=${getLS('city')},${getLS('country')}`;
    // https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.API_KEY}&units=imperial
    // https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.API_KEY}&units=imperial
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${config.OPENWEATHER_API_KEY}&units=imperial`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            resolve(data);
        })
        .catch(error => {
            showError('Unable to reach weather service at this time. Please wait a few minutes, then refresh the page.');
            //animateSky("default");
            reject(error);
        });
});

/* let refreshData;
let timeRemainingInCycle = 60000;
let updateTimeRemainingInCycle; */

state.setMultipleProperties([
    ['refreshData', ''],
    ['timeRemainingInCycle', 60000],
    ['updateTimeRemainingInCycle', '']
])

// msElapsed should reset at 60, but not on each updateWeather recall (unless we're changing locations)

// updateWeather fetches fresh weather data every 60 seconds
// (in sync with background animations)
// updateTimeRemeainingInCycle saves the number of ms elapsed since
// the start of the cycle (in 100ms increments) in case the app is paused,
// after which the refreshData is called again with the remaining time
// (psuedo-pause/resume)
const updateWeather = (lat, lon, wasPaused) => {
    
    if(!wasPaused){ state.timeRemainingInCycle = 60000; }

    state.refreshData = setTimeout(() => {
        getWeather(lat, lon)
        .then((data) => {
            updateDOM(data);
            clearInterval(state.updateTimeRemainingInCycle);
            updateWeather(lat, lon);
        });
    }, state.timeRemainingInCycle);

    state.updateTimeRemainingInCycle = setInterval(() => {
        state.timeRemainingInCycle  -= 100;
        if(state.timeRemainingInCycle  <= 0){
            clearInterval(state.updateTimeRemainingInCycle);
        }
    }, 100);
    
}

const updateAll = async () => {
    await getWeather(state.lat, state.lon)
    .then((data) => {
        const weather = data.current.weather[0].main;
        const current = data.current;
        const today = data.daily[0];
        const tz = data.timezone;

        state.setMultipleProperties([
            ['weather', weather],
            ['current', current],
            ['today', today],
            ['tz', tz],
            ['forecast', data.daily]
        ]);
        console.log(state);
        updateDOM(data);
        if(state.refreshData !== undefined){ clearTimeout(state.refreshData); };
        // updateWeather(location.lat, location.lon);
        updateWeather(state.lat, state.lon);
        settingsBtn.disabled = false;
    })
    .catch((err) => {
        console.error(err);
    });
};


const setup = async () => {
    // const location = {};
    await getLocation()
    .then((data) => {
        console.log(data);
        // location.lat = data.lat;
       //  location.lon = data.lon;
        state.setMultipleProperties([
            ['lat', data.lat],
            ['lon', data.lon]
        ]);
        console.log(state);
        // return location;
    })
    // (location)
    .then(async () => {
        // await reverseGeocode(location.lat, location.lon, config.GOOGLE_API_KEY)
        await reverseGeocode(state.lat, state.lon, config.GOOGLE_API_KEY)
        // .then(value => location.name = value);
        .then(value => state.location = value);
        return location;
    })
    // (location)
    .then(async () => {
        // displayLocation(location.name);
        displayLocation(state.location);
        //updateAll(location);
        updateAll();
    })
    .then(() => {
        toggleLoader();
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


const updateLocation = async (location) => {
    toggleLoader(true);
    clearError();
    //toggleHidden(document.getElementById('continue'));
    const updatedLocation = {};
    await geocode(location)
    .then(data => {
        console.log(data);
        state.setMultipleProperties([
            ['lat', data.results[0].geometry.location.lat],
            ['lon', data.results[0].geometry.location.lng]
        ]);
        /* updatedLocation.lat = data.results[0].geometry.location.lat;
        updatedLocation.lon = data.results[0].geometry.location.lng; */
        /* setLS([
            { key: lat, value: data.results[0].geometry.location.lat },
            { key: lon, value: data.results[0].geometry.location.lng }
        ]); */
        // return updatedLocation;
    })
    .then(async () => {
        updateAll();
    })
    .then(() => {
        toggleLoader();
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

const settingsContainer = document.getElementById('settings__container');


state.setProperty(['isPaused', false]);



settingsBtn.addEventListener('click', () => {
    toggleAppPause(state);
});

toggleLoader();
/* if(!getLS('unit')){
    setLS([{key: 'unit', value: 'imperial'}]);
} */
toggleDisplayUnits();
setup();

