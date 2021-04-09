import WeatherApp from './scripts/WeatherApp.js';
import AutocompleteSearchBar from './scripts/AutocompleteSearchBar.js';
/* import ErrorHandler from './scripts/ErrorHandler.js';
import Animations from './scripts/Animations.js'; */

/* // set up ErrorHandler to display any errors
const errorElement = new ErrorHandler(document.getElementById('error')); */

/* // on page load, initialize Animatons with background element
const animations = new Animations(document.getElementById('weather')); */



/* // on page load, create a new google autocomplete search bar
const autocompleteSearchBar = new AutocompleteSearchBar(document.getElementById('search'), document.getElementById('googleScript')); */

// DOM elements
const elements = {
    autocompleteSearchBar: new AutocompleteSearchBar(document.getElementById('search'), document.getElementById('googleScript')),
    toggleSettingsMenuButton: document.getElementById('settings'),
    closeSettingsMenuButton: document.getElementById('settings__close'),
    settingsButtons: Array.from(document.getElementsByClassName('settings__button')),
    settingsMenuIcon: document.getElementById('settings__icon')
}

// Event Listeners
elements.toggleSettingsMenuButton.addEventListener('click', () => {
    app.toggleAppPause();
});

elements.closeSettingsMenuButton.addEventListener('click', () => {
    app.toggleAppPause();
});

elements.settingsButtons.forEach(el => {
    el.addEventListener('mouseover', () => {
        elements.settingsMenuIcon.className = `fas fa-${el.id}`;
    });
});

elements.settingsButtons.forEach(el => {
    el.addEventListener('mouseout', () => {
        elements.settingsMenuIcon.className = 'fas fa-cloud-sun';
    });
});

// on page load, create a new instance of WeatherApp
// call app.initialize() to fetch initial data
const app = new WeatherApp();
app.initialize();





// --- OLD  ---
/* import { setLS, getLS } from './scripts/LS.js';
import getLocation from './scripts/location.js';
import { geocode, reverseGeocode } from './scripts/geocoding.js';
import autocompleteSearchBar from './scripts/autocompleteSearchBar.js';
import { toggleDisplayUnits, toggleLoader, toggleHidden, toggleIsPaused, toggleAppPause, toggleLoaderWithBuffer } from './scripts/controls.js';
import { showError, clearError } from './scripts/errorHandler.js';
import { getWeather, updateWeather } from "./scripts/weather.js";
import { isDay } from './scripts/utilities.js';
import menu from './scripts/menu.js'; */




//export default app.state;

/* const updateAll = async (state) => {
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

export default state; */