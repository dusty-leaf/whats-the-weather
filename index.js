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
    const tz = data.timezone;
    // clearParticles();
    setLS([{ key: 'weather', value: weather }]);
    displayClock(tz);
    displayDate(tz);
    displayWeather(current.weather[0].id, weather, tz);
    displayTemperature(current.temp, current.feels_like, today.temp.max, today.temp.min);
    displayForecast(data.daily);
    animateSky(weather, today.sunrise, today.sunset, location.lat, location.lon);
    animateWeatherGFX(weather, weather.id, tz);
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

let refreshData;
let timeRemainingInCycle = 60000;
let trackTimeRemainingInCycle;

// msElapsed should reset at 60, but not on each trackWeather recall (unless we're changing locations)

// trackWeather fetches fresh weather data every 60 seconds
// (in sync with background animations)
// trackTimeRemeainingInCycle saves the number of ms elapsed since
// the start of the cycle (in 100ms increments) in case the app is paused,
// after which the refreshData is called again with the remaining time
// (psuedo-pause/resume)
const trackWeather = (lat, lon, AppWasPaused) => {
    
    if(!AppWasPaused){ timeRemainingInCycle = 60000; }
    console.log(timeRemainingInCycle);

    refreshData = setTimeout(() => {
        getWeather(lat, lon)
        .then((data) => {
            updateLS(data);
            updateDOM(data);
            clearInterval(trackTimeRemainingInCycle);
            trackWeather(lat, lon);
        });
    }, timeRemainingInCycle);

    trackTimeRemainingInCycle = setInterval(() => {
        timeRemainingInCycle  -= 100;
        console.log(timeRemainingInCycle);
        if(timeRemainingInCycle  <= 0){
            clearInterval(trackTimeRemainingInCycle);
        }
    }, 100);
    
}

const displayAll = async (location) => {
    await getWeather(location.lat, location.lon)
    .then((data) => {
        updateDOM(data);
        updateLS(data);
        if(refreshData){ clearTimeout(refreshData); };
        trackWeather(location.lat, location.lon);
        settingsBtn.disabled = false;
    })
    .catch((err) => {
        console.error(err);
    });
};


const setup = async () => {
    const location = {};
    await getLocation()
    .then((data) => {
        location.lat = data.lat;
        location.lon = data.lon;
        setLS([
            { key: 'lat', value: data.lat },
            { key: 'lon', value: data.lon }
        ]);
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
        displayAll(location);
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
    toggleHidden(document.getElementById('continue'));
    const updatedLocation = {};
    await geocode(location)
    .then(data => {
        console.log(data);
        updatedLocation.lat = data.results[0].geometry.location.lat;
        updatedLocation.lon = data.results[0].geometry.location.lng;
        setLS([
            { key: lat, value: data.results[0].geometry.location.lat },
            { key: lon, value: data.results[0].geometry.location.lng }
        ]);
        return updatedLocation;
    })
    .then((location) => {
        displayAll(location);
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

const settingsContainer = document.getElementById('settings-menu');

let isPaused = false;

const toggleIsPaused = () => {
    
    if(isPaused){ return false; }
    return true;
}

const toggleAppPause = () => {
    if(!isPaused){
        isPaused = toggleIsPaused();
        clearTimeout(refreshData);
        clearInterval(trackTimeRemainingInCycle);
        toggleParticleAnimations();
        settingsContainer.classList.toggle('hidden');
        return;
    }

    if(isPaused === true){
        isPaused = toggleIsPaused();
        trackWeather(getLS('lat'), getLS('lon'), true);
        toggleParticleAnimations();
        settingsContainer.classList.toggle('hidden');
        return;
    }
}


settingsBtn.addEventListener('click', toggleAppPause);

toggleLoader();
if(!getLS('unit')){
    setLS([{key: 'unit', value: 'imperial'}]);
}
toggleDisplayUnits();
setup();

