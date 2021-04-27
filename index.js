import WeatherApp from './scripts/WeatherApp.js';
import AutocompleteSearchBar from './scripts/AutocompleteSearchBar.js';
import Utilities from './scripts/Utilities.js';
//import ErrorHandler from './scripts/ErrorHandler.js';


// --- ELEMENTS ---

const buttons = {
    toggleSettingsMenu: document.querySelector('.js-toggleSettingsMenu'),
    closeSettingsMenu: document.querySelector('.js-closeSettingsMenu'),
    settingsOptions: Array.from(document.querySelectorAll('.js-settingsOption')),
    start: document.querySelector('.js-start'),
    toggleFarenheit: document.querySelector('.js-toggleFarenheit'),
    toggleCelsius: document.querySelector('.js-toggleCelsius'),
    reset: document.querySelector('.js-reset'),
    searchSubmit: document.querySelector('.js-searchSubmit'),
    navToggle: document.querySelector('.js-navToggle'),
    navToggleOuter: document.querySelector('.js-navToggleOuter')
}

const components = {
    nav: document.querySelector('.js-nav'),
    weatherWrapper: document.querySelector('.js-weatherWrapper'),
    loader: document.querySelector('.js-loader'),
    loaderMessage: document.querySelector('.js-loaderMessage')
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

const DOMMethods = {
    toggleSearch: function(){
        Utilities.toggleDisabled(inputs.search);
        Utilities.toggleDisabled(buttons.searchSubmit);
    },
    toggleMenu: function(){
        this.toggleSearch();
        Utilities.toggleHidden(settingsContainerElement);
    },
    toggleUnitButtons: function(){
        Utilities.toggleHidden(buttons.toggleFarenheit);
        Utilities.toggleHidden(buttons.toggleCelsius);
    },
    toggleWeatherWrapper: function(){
        Utilities.toggleHidden(components.weatherWrapper);
    },
    toggleNav: function(){
        Utilities.toggleHidden(components.nav);
        //Utilities.toggleHidden(buttons.navToggle);
        Utilities.toggleHidden(buttons.navToggleOuter);
    },
    toggleLoader: function(){
        Utilities.toggleHidden(components.loader);
    },
    clearLoaderMessage: function(){
        components.loaderMessage.innerHTML = '';
    }
}

// --- SETUP ---

// on page load, create a new instance of WeatherApp
const app = new WeatherApp();

// on page load, create new autocomplete search bar
const search = new AutocompleteSearchBar(inputs.search, scripts.google, { types: ['(cities)'] });

// Initial app state
DOMMethods.toggleLoader();
Utilities.toggleDisabled(buttons.toggleSettingsMenu);

let appIsStarted = false;
inputs.search.value = '';



// --- USER CONTROLS ---

// start app
buttons.start.addEventListener('click', async () => {
    
    // prevent user from selecting animations before app is initialized
    Utilities.toggleDisabled(buttons.toggleSettingsMenu);

    appIsStarted = true;

    // clear welcome message
    DOMMethods.clearLoaderMessage();

    // call app.initialize() to fetch initial data
    await app.initialize()
    .then(() => {
        // remove loader once app is initialized
        DOMMethods.toggleLoader();
    });

});


// select new location
buttons.searchSubmit.addEventListener('click', async () => {

    // do nothing if there's no search value
    if(!inputs.search.value){ return; }

    // clear the current clock
    clearInterval(app.state.clockInterval)

    // clear welcome message if present
    ErrorHandler.clearError();

    // save the city/town name to app.state.location for display purposes
    app.updateState('location', inputs.search.value.slice(0, inputs.search.value.indexOf(',')));

    // format the location for app.updateLocationData()
    const regex = /\s|,\s/g;
    const newLocation = inputs.search.value.replaceAll(regex, '+');

    // dispay Loader & disable further searches while updating data
    // don't disabled loader if user manually picks location on app start
    // then flag app as started
    if(appIsStarted === true){
        DOMMethods.toggleLoader();
    } else {
        appIsStarted = true;
        DOMMethods.clearLoaderMessage();
    }
    
    DOMMethods.toggleSearch();

    // updata data
    await app.updateLocationData(newLocation)
    .then(async () => {
        await app.updateWeatherData();
    })
    .then(() => {
        // render with new data and track data for updated location
        app.render();
        app.keepWeatherDataUpdated();
        
        // clear Loader & re-enable search once new data is rendered
        DOMMethods.toggleLoader();
        DOMMethods.toggleSearch();

        // enable settings if manual location pick at app start
        buttons.toggleSettingsMenu.disabled = false;
        if(components.weatherWrapper.classList.contains('hidden')){
            DOMMethods.toggleWeatherWrapper();
        }
        
    })
    .catch(err => {
        
        // clear Loader & re-enable if search fails
        alert('Invalid location. Click [Ok] then try a different location.');
        DOMMethods.toggleLoader();
        DOMMethods.toggleSearch();
    });
    
});

// show/hide nav
buttons.navToggle.addEventListener('click', () =>{
    //components.nav.classList.toggle('foreground-max');
    // Utilities.toggleVisibility(components.nav);
    // DOMMethods.toggleNavToggles();
    DOMMethods.toggleNav();
});

buttons.navToggleOuter.addEventListener('click', () =>{
    //components.nav.classList.toggle('foreground-max');
    DOMMethods.toggleNav();
});




// open & close settings menu
buttons.toggleSettingsMenu.addEventListener('click', () => {
    DOMMethods.toggleMenu();
    app.toggleAppPause();
});

buttons.closeSettingsMenu.addEventListener('click', () => {
    DOMMethods.toggleMenu();
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
        DOMMethods.toggleMenu();
        app.toggleAppPause();
        app.keepWeatherDataUpdated();
        app.render();
        
    });
})


// change the weather animations to reflect current data
buttons.reset.addEventListener('click', () => {
    app.updateState([
        ['toggledWeather', ''],
        ['timeRemainingInCycle', 60000]
    ]);
    app.toggleAppPause();
    DOMMethods.toggleMenu();
    app.render();
});



// display correct unit button on start based on saved user preference
if(localStorage.getItem('unit') === 'celsius'){
    DOMMethods.toggleUnitButtons();
}

// toggle units (display only) to farenheit or celsius
buttons.toggleFarenheit.addEventListener('click', () => {
    app.updateState('unit', 'imperial');
    localStorage.setItem('unit', 'imperial');
    DOMMethods.toggleUnitButtons();
    app.toggleDisplayUnits(buttons.toggleFarenheit, buttons.toggleCelsius);

});

buttons.toggleCelsius.addEventListener('click', () => {
    app.updateState('unit', 'celsius');
    localStorage.setItem('unit', 'celsius');
    DOMMethods.toggleUnitButtons();
    app.toggleDisplayUnits();
});