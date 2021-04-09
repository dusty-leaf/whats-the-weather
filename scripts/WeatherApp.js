import config from './config.js';
import Geocoding from "./Geocoding.js";
import ErrorHandler from './ErrorHandler.js';
import Animations from './Animations.js';
import RenderMethods from './RenderMethods.js';
import Utilities from './Utilities.js';
//import { displayWeather, displayTemperature, displayForecast, displayLocation, displayDate, displayClock } from './displayUI.js';
// import ErrorHandler from './ErrorHandler.js';

// import { animateWeatherGFX, animateSky, clearParticles, toggleParticleAnimations }from './animations.js';

class WeatherApp {
    constructor(){ //errorElement, animations)
        this.state = {
            // initial properties on creation
            isPaused: false,
            refreshData: '',
            timeRemainingInCycle: 60000,
            upgetDateTimeRemainingInCycle: '',
            clockInterval: '',
            weather: '',
            id: '',
            temperature: 0,
            feels_like: 0,
            max: '',
            min: '',
            toggledWeather: '',
            unit: 'imperial',
            //current: '',
            //today: '',
            timezone: '',
            sunrise: 0,
            sunset: 0,
            forecast: '',
            lat: 0,
            lon: 0,
            location: '',
            setMultipleProperties: function(arr){
                arr.forEach((el) => {
                    this[el[0]] = el[1];
                });
            }
        }; 
        //this.errorHandler = new ErrorHandler(document.getElementById('error'));
        //this.animations = new Animations(document.getElementById('weather'));
    }

    render() {
        const weather = this.state.toggledWeather ? this.state.toggledWeather : this.state.weather;
        const data = this.state;
        RenderMethods.displayDate(data); // this.state.timezone
        RenderMethods.displayClock(data); // this.state.timezone, this.state.clockInterval
        RenderMethods.displayLocation(data); // this.state.location
        RenderMethods.displayWeather(data); // this.state.current.weather[0].id, this.state.weather, this.state.timezone
        RenderMethods.displayTemperature(data); //this.state.current.temp, this.state.current.feels_like, this.state.today.temp.max, this.state.today.temp.min, this.state.unit
        RenderMethods.displayForecast(data); // this.state.forecast, this.state.unit
        Animations.animateSky(weather, data); // this.state.today.sunrise, this.state.today.sunset this.state.lat, this.state.lon
        Animations.animateWeatherGFX(weather, data); // this.state.id, this.state.timezone
    }

    async getWeather({lat, lon}){
        return new Promise(
            (resolve, reject) => {
                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${config.OPENWEATHER_API_KEY}&units=imperial`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    resolve(data);
                })
                .catch(error => {
                    ErrorHandler.showError('Unable to reach weather service at this time. Please wait a few minutes, then refresh the page.');
                    //animateSky("default");
                    reject(error);
                });
            }
        );
    }

    async updateWeatherData(){
        return await this.getWeather(this.state)
        .then((data) => {
            this.state.setMultipleProperties([
                ['weather', data.current.weather[0].main],
                ['id', data.current.weather[0].id],
                ['temperature', data.current.temp],
                //['current', data.current],
                ['feels_like', data.current.feels_like],
                ['max', data.daily[0].temp.max],
                ['min', data.daily[0].temp.min],
                ['today', data.daily[0]],
                ['timezone', data.timezone],
                ['sunrise', data.daily[0].sunrise],
                ['sunset', data.daily[0].sunset],
                ['forecast', data.daily]
            ]);
        }); 
    }

    // keepWeatherDataUpdated fetches fresh weather data every 60 seconds
    // (in sync with background animations)
    // updateTimeRemeainingInCycle saves the number of ms elapsed since
    // the start of the cycle (in 100ms increments) in case the app is paused,
    // after which the refreshData is called again with the remaining time
    // (psuedo-pause/resume)

    async keepWeatherDataUpdated(wasPaused){
        if(!wasPaused){ this.state.timeRemainingInCycle = 60000; }

        this.state.refreshData = setTimeout(() => {
            this.updateWeatherData()
            .then(() => {
                this.render();
                clearInterval(this.state.updateTimeRemainingInCycle);
                this.keepWeatherDataUpdated();
            });
        }, this.state.timeRemainingInCycle);

        this.state.updateTimeRemainingInCycle = setInterval(() => {
            this.state.timeRemainingInCycle  -= 100;
            if(this.state.timeRemainingInCycle  <= 0){
                clearInterval(this.state.updateTimeRemainingInCycle);
            }
        }, 100);
    }

    async getLocationData(){
        return new Promise(
            (resolve, reject) => {
            
                const success = (position) => {
                    resolve({ lat: position.coords.latitude, lon: position.coords.longitude });
                }
                    
                const error = (err) => {
                    reject(err);
                }
            
                if(!window.navigator.geolocation){
                    ErrorHandler.showError('Geolocation is not supported by your browser.');
                } else {
                    /* const continueBtn = document.getElementById('continue');
                    continueBtn.addEventListener('click', () => { */
                    window.navigator.geolocation.getCurrentPosition(success, error);
                    // });
                }
            }
        );
    }

    async updateLocationData(location){
        await Geocoding.geocode(location)
        .then(data => {
            this.state.setMultipleProperties([
                ['lat', data.results[0].geometry.location.lat],
                ['lon', data.results[0].geometry.location.lng]
            ]);
        });
    }

    // CONTROLS

    toggleLoader(isLoaderAlreadyRunning){
        const loaderElement = document.getElementById('loader');
    
        if(isLoaderAlreadyRunning && !loaderElement.classList.contains('hidden')){
            return;
        }
    
        loaderElement.classList.toggle('hidden');
    }

    toggleIsPaused(){
        if(this.state.isPaused){ return false; }
        return true;
    }

    toggleAppPause(){
        const searchInput = document.getElementById('search');
        const searchSubmit = document.getElementById('search-submit');
        const settingsContainer = document.getElementById('settings__container');
    
        if(!this.state.isPaused){
            this.state.isPaused = this.toggleIsPaused();
            searchInput.disabled = true;
            searchSubmit.disabled = true;
            clearTimeout(this.state.refreshData);
            clearInterval(this.state.updateTimeRemainingInCycle);
            Animations.toggleParticleAnimations();
            Utilities.toggleHidden(settingsContainer);
            //settingsContainer.classList.toggle('hidden');
            return;
        }
    
        this.state.isPaused = this.toggleIsPaused();
        searchInput.disabled = false;
        searchSubmit.disabled = false;
        Animations.toggleParticleAnimations();
        Utilities.toggleHidden(settingsContainer);
        //settingsContainer.classList.toggle('hidden');
        this.keepWeatherDataUpdated(true);
        return;
    }

    toggleDisplayUnits(farenheitButton, celsiusButton){
        RenderMethods.displayTemperature(this.state);
        RenderMethods.displayForecast(this.state);
        Utilities.toggleHidden(farenheitButton);
        Utilities.toggleHidden(celsiusButton);
    }

    async initialize(){

        // enable Loader while data is being fetched
        //this.toggleLoader();
        
        // get user latitude and longitude coords from geolocator API
        await this.getLocationData()
        .then(data => {
            // update state with coords
            this.state.setMultipleProperties([
                ['lat', data.lat],
                ['lon', data.lon]
            ]);
        })
        .then(async () => {
            // use coords to get place name and add it to state
            await Geocoding.reverseGeocode(this.state.lat, this.state.lon, config.GOOGLE_API_KEY)
            .then(data => this.state.location = data)
        })
        .then(async () => {
            await this.updateWeatherData()
        })
        .then(() => {
            // rerender DOM with updated state and disable Loader
            this.render();
            this.keepWeatherDataUpdated();
            this.toggleLoader();
        })
        .catch(error => ErrorHandler.showError(error));
    }
}

export default WeatherApp;

