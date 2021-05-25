'use strict';

import Geocoding from "./Geocoding.js";
import Animations from './Animations.js';
import RenderMethods from './RenderMethods.js';
import Utilities from './Utilities.js';


class WeatherApp {
    constructor(){ 
        this.state = {
            // initial properties on creation
            isPaused: false,
            refreshData: '',
            timeRemainingInCycle: 60000,
            updateTimeRemainingInCycle: '',
            clockInterval: undefined,
            weather: '',
            id: '',
            temperature: 0,
            feels_like: 0,
            max: '',
            min: '',
            toggledWeather: '',
            unit: localStorage.getItem('unit'),
            timezone: '',
            sunrise: 0,
            sunset: 0,
            forecast: '',
            lat: 0,
            lon: 0,
            location: '',
            clockElement: document.querySelector('.js-clock')
        }; 
    }

    // updateState accepts either a key and a value or an array of keys and values
    updateState(...args){
        // ex: updateState('key', value)
        if(args.length === 2){
            return this.state[args[0]] = args[1];
        }

        // ex: updateState([['key', value], ['key', value], etc...])
        args[0].forEach((el) => {
            this.state[el[0]] = el[1];
        });

    }

    updateClock(){
        clearInterval(this.state.clockInterval);
        RenderMethods.displayTime(this.state);
        this.updateState('clockInterval', setInterval(() => {
            RenderMethods.displayTime(this.state);
        }, 1000));
    }

    render(){
        // (animations only) use user selected weather status if selected, 
        //   otherwise use default (actual) weather status
        const weather = this.state.toggledWeather ? this.state.toggledWeather : this.state.weather;
        const data = this.state;

        const weatherWrapper = document.querySelector('.js-weatherWrapper');
        if(weatherWrapper.classList.contains('hidden')){
            Utilities.toggleHidden(weatherWrapper);
        }
        
        // new clock instance
        this.updateClock();

        RenderMethods.displayDate(data);
        RenderMethods.displayLocation(data);
        RenderMethods.displayWeather(data);
        RenderMethods.displayTemperature(data);
        RenderMethods.displayForecast(data);
        Animations.animateWeatherGFX(weather, data);
        Animations.paintBackground(weather, data);
    }

    async getWeather({lat, lon}){
        return new Promise(
            (resolve, reject) => {
                fetch(`https://radiant-lowlands-59230.herokuapp.com/onecall?lat=${lat}&lon=${lon}`)
                .then(response => response.json())
                .then(data => {
                    resolve(data.json);
                })
                .catch(error => {
                    reject(error);
                });
            }
        );
    }

    async updateWeatherData(){
        return await this.getWeather(this.state)
        .then((data) => {
            this.updateState([
                ['weather', data.current.weather[0].main],
                ['id', data.current.weather[0].id],
                ['temperature', data.current.temp],
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
    
        // if app wasn't paused, keepWeatherDataUpdated is starting a new cycle,
        //   so timeRemaininInCycle needs to be reset
        if(!wasPaused){ this.state.timeRemainingInCycle = 60000; }
        
        // reset 
        clearTimeout(this.state.refreshData); 
        clearInterval(this.state.updateTimeRemainingInCycle);

        const startNewCycle = async () => {
            await this.updateWeatherData()
            .then(() => {
                this.render();
                this.keepWeatherDataUpdated();
            });
        }
                
        // recursively call keepWeatherDataUpdated at end of cycle.
        // updateTimeRemainingInCycle & refreshData may not always 
        //  exactly sync up, so whichever technically completes
        //  a cycle first will make the next recursive call

        this.state.updateTimeRemainingInCycle = setInterval(() => {
            this.state.timeRemainingInCycle  -= 100;
            if(this.state.timeRemainingInCycle  <= 0){
                startNewCycle();
            }
        }, 100);

        
        this.state.refreshData = setTimeout(() => {
            startNewCycle();
        }, this.state.timeRemainingInCycle);
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
                    alert('Geolocation is not supported by your browser.');
                } else {
                    window.navigator.geolocation.getCurrentPosition(success, error);
                }
            }
        );
    }

    async updateLocationData(location){
        await Geocoding.geocode(location)
        .then(data => {
            this.updateState([
                ['lat', data.json.results[0].geometry.location.lat],
                ['lon', data.json.results[0].geometry.location.lng]
            ]);
        });
    }

    toggleIsPaused(){
        if(this.state.isPaused){ return false; }
        return true;
    }

    toggleAppPause(){
        if(!this.state.isPaused){
            this.state.isPaused = this.toggleIsPaused();
            clearInterval(this.state.updateTimeRemainingInCycle);
            clearTimeout(this.state.refreshData);
            Animations.toggleParticleAnimations();
            return;
        }
    
        this.state.isPaused = this.toggleIsPaused();
        Animations.toggleParticleAnimations();
        this.keepWeatherDataUpdated(true);
        return;
    }

    toggleDisplayUnits(){
        RenderMethods.displayTemperature(this.state);
        RenderMethods.displayForecast(this.state);
    }

    async initialize(){
        
        // get user latitude and longitude coords from geolocator API
        await this.getLocationData()
        .then(data => {
            // update state with coords
            this.updateState([
                ['lat', data.lat],
                ['lon', data.lon]
            ]);
        })
        .then(async () => {
            // use coords to get place name and add it to state
            await Geocoding.reverseGeocode(this.state.lat, this.state.lon)
            .then(data => this.state.location = data)
        })
        .then(async () => {
            await this.updateWeatherData()
        })
        .then(() => {
            // rerender DOM with updated state and disable Loader
            this.render();
            this.keepWeatherDataUpdated();
        })
        .catch((error) => {
            console.error(error);
        });
    }
}

export default WeatherApp;