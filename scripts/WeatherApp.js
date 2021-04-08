import config from './config.js';
import Geocoding from "./Geocoding.js";
import ErrorHandler from './ErrorHandler.js';
import Animations from './Animations.js';
import RenderMethods from './RenderMethods.js';
//import { displayWeather, displayTemperature, displayForecast, displayLocation, displayDate, displayClock } from './displayUI.js';
// import ErrorHandler from './ErrorHandler.js';

// import { animateWeatherGFX, animateSky, clearParticles, toggleParticleAnimations }from './animations.js';

class WeatherApp {
    constructor(errorElement, animations){
        this.state = {
            // initial properties on creation
            isPaused: false,
            refreshData: '',
            timeRemainingInCycle: 60000,
            upgetDateTimeRemainingInCycle: '',
            clockInterval: '',
            weather: '',
            toggledWeather: '',
            unit: 'imperial',
            current: '',
            today: '',
            timezone: '',
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
        this.errorHandler = new ErrorHandler(document.getElementById('error'));
        this.animations = new Animations(document.getElementById('weather'));
    }

    render() {
        const weather = this.state.toggledWeather ? this.state.toggledWeather : this.state.weather;
        RenderMethods.displayDate(this.state.timezone);
        RenderMethods.displayClock(this.state.timezone, this.state.clockInterval);
        RenderMethods.displayLocation(this.state.location);
        RenderMethods.displayWeather(this.state.current.weather[0].id, this.state.weather, this.state.timezone);
        RenderMethods.displayTemperature(this.state.current.temp, this.state.current.feels_like, this.state.today.temp.max, this.state.today.temp.min, this.state.unit);
        RenderMethods.displayForecast(this.state.forecast, this.state.unit);
        this.animations.animateSky(weather, this.state.today.sunrise, this.state.today.sunset, this.state.lat, this.state.lon);
        this.animations.animateWeatherGFX(weather, this.state.weather.id, this.state.timezone);
    }

    async getWeather(){
        return new Promise(
            (resolve, reject) => {
                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.lat}&lon=${this.state.lon}&exclude=minutely,hourly&appid=${config.OPENWEATHER_API_KEY}&units=imperial`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    resolve(data);
                })
                .catch(error => {
                    this.errorHandler.showError('Unable to reach weather service at this time. Please wait a few minutes, then refresh the page.');
                    //animateSky("default");
                    reject(error);
                });
            }
        );
    }

    async updateWeatherData(){
        await this.getWeather(this.state)
        .then((data) => {
            this.state.setMultipleProperties([
                ['weather', data.current.weather[0].main],
                ['current', data.current],
                ['today', data.daily[0]],
                ['timezone', data.timezone],
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
            this.getWeather()
            .then((data) => {
                this.state.setMultipleProperties([
                    ['weather', data.current.weather[0].main],
                    ['current', data.current],
                    ['today', data.daily[0]],
                    ['timezone', data.timezone],
                    ['forecast', data.daily]
                ]);
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
                    this.errorHandler.showError('Geolocation is not supported by your browser.');
                } else {
                    const continueBtn = document.getElementById('continue');
                    continueBtn.addEventListener('click', () => {
                        window.navigator.geolocation.getCurrentPosition(success, error);
                    });
                }
            }
        );
    }

    async updateLocationData(){
        await Geocoding.geocode(location)
        .then(data => {
            this.state.setMultipleProperties([
                ['lat', data.results[0].geometry.location.lat],
                ['lon', data.results[0].geometry.location.lng]
            ]);
        });
    }

    toggleLoader(isLoaderAlreadyRunning){
        const loaderElement = document.getElementById('loader');
    
        if(isLoaderAlreadyRunning && !loaderElement.classList.contains('hidden')){
            return;
        }
    
        loaderElement.classList.toggle('hidden');
    }

    async initialize(){

        // enable Loader while data is being fetched
        this.toggleLoader();
        
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
        .catch(error => this.errorHandler.showError(error));
    }
}

export default WeatherApp;

