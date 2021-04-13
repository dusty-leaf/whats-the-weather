import WeatherApp from './scripts/WeatherApp.js';
import AutocompleteSearchBar from './scripts/AutocompleteSearchBar.js';
import Utilities from './scripts/Utilities.js';


// --- ELEMENTS ---

const buttons = {
    toggleSettingsMenu: document.querySelector('.js-toggleSettingsMenu'),
    closeSettingsMenu: document.querySelector('.js-closeSettingsMenu'),
    settingsOptions: Array.from(document.querySelectorAll('.js-settingsOption')),
    start: document.querySelector('.js-start'),
    toggleFarenheit: document.querySelector('.js-toggleFarenheit'),
    toggleCelsius: document.querySelector('.js-toggleCelsius'),
    reset: document.querySelector('.js-reset'),
    searchSubmit: document.querySelector('.js-searchSubmit')
}

const inputs = {
    search: document.querySelector('.js-searchInput')
}

const icons = {
    settingsMenu: document.querySelector('.js-settingsIcon')
}

const scripts = {
    google: document.getElementById('js-google')
}

const settingsContainerElement = document.querySelector('.js-settingsContainer');


// --- DOM Helper Functions ---

const DOMHelpers = {
    toggleMenu: function(){
        Utilities.toggleDisabled(inputs.search);
        Utilities.toggleDisabled(buttons.searchSubmit);
        Utilities.toggleHidden(settingsContainerElement);
    },
    toggleUnitButtons: function(){
        Utilities.toggleHidden(buttons.toggleFarenheit);
        Utilities.toggleHidden(buttons.toggleCelsius);
    }
}


// --- SETUP ---

// on page load, create a new instance of WeatherApp
const app = new WeatherApp();


// on page load, create new autocomplete search bar
const search = new AutocompleteSearchBar(inputs.search, scripts.google, { types: ['(cities)'] });

// Initial app state
app.toggleLoader();
buttons.toggleSettingsMenu.disabled = true;



// --- USER CONTROLS ---

// start app
buttons.start.addEventListener('click', () => {
    // call app.initialize() to fetch initial data
    app.initialize();
    buttons.toggleSettingsMenu.disabled = false;

});


// search bar
buttons.searchSubmit.addEventListener('click', async () => {
    clearInterval(app.state.clockInterval)
    const regex = /\s|,\s/g;
    //displayLocation(searchInput.value.slice(0, searchInput.value.indexOf(',')));
    app.updateState('location', inputs.search.value.slice(0, inputs.search.value.indexOf(',')));
    const newLocation = inputs.search.value.replaceAll(regex, '+');
    app.toggleLoader();
    await app.updateLocationData(newLocation)
    .then(async () => {
        await app.updateWeatherData();
    })
    .then(() => {
        app.render();
        app.keepWeatherDataUpdated();
        app.toggleLoader();
    });
    
});


// open & close settings menu
buttons.toggleSettingsMenu.addEventListener('click', () => {
    DOMHelpers.toggleMenu();
    app.toggleAppPause();
});

buttons.closeSettingsMenu.addEventListener('click', () => {
    DOMHelpers.toggleMenu();
    app.toggleAppPause();
});


// settings menu icon animations
buttons.settingsOptions.forEach(el => {
    el.addEventListener('mouseover', () => {
        icons.settingsMenu.className = `fas fa-${el.id}`;
    });
});

buttons.settingsOptions.forEach(el => {
    el.addEventListener('mouseout', () => {
        icons.settingsMenu.className = 'fas fa-cloud-sun';
    });
});


// change the weather animations to reflect user choice
buttons.settingsOptions.forEach(el => {
    el.addEventListener('click', () => {
        app.updateState('toggledWeather', el.dataset.weather);
        DOMHelpers.toggleMenu();
        app.toggleAppPause();
        app.render();
        
    });
})


// change the weather animations to reflect current data
buttons.reset.addEventListener('click', () => {
    app.updateState('toggledWeather', '');
    app.toggleAppPause();
    DOMHelpers.toggleMenu();
    app.render();
});



// display correct unit button on start based on saved user preference
if(localStorage.getItem('unit') === 'celsius'){
    DOMHelpers.toggleUnitButtons();
}

// toggle units (display only) to farenheit or celsius
buttons.toggleFarenheit.addEventListener('click', () => {
    app.updateState('unit', 'imperial');
    localStorage.setItem('unit', 'imperial');
    DOMHelpers.toggleUnitButtons();
    app.toggleDisplayUnits(buttons.toggleFarenheit, buttons.toggleCelsius);

});

buttons.toggleCelsius.addEventListener('click', () => {
    app.updateState('unit', 'celsius');
    localStorage.setItem('unit', 'celsius');
    DOMHelpers.toggleUnitButtons();
    app.toggleDisplayUnits(buttons.toggleFarenheit, buttons.toggleCelsius);
});








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