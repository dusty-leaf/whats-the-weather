import config from './config.js';
import * as Geocoding from "./geocoding.js";
import { animateWeatherGFX, animateSky, clearParticles, toggleParticleAnimations }from './animations.js';
import { displayWeather, displayTemperature, displayForecast, displayLocation, displayDate, displayClock } from './displayUI.js';


class WeatherApp {
    constructor(){
        this.state = {
            // initial properties on creation
            isPaused: false,
            refreshData: '',
            timeRemainingInCycle: 60000,
            updateTimeRemainingInCylce: '',
            weather: '',
            displayWeather: this.weather,
            current: '',
            today: '',
            tz: '',
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
    }

    render() {
        const weather = this.state.toggledWeather ? this.state.toggledWeather : this.state.weather;
        displayDate(this.state.tz);
        displayClock(this.state.tz);
        displayLocation(this.state.location);
        displayWeather(this.state.current.weather[0].id, this.state.weather, this.state.tz);
        displayTemperature(this.state.current.temp, this.state.current.feels_like, this.state.today.temp.max, this.state.today.temp.min);
        displayForecast(this.state.forecast);
        animateSky(weather, this.state.today.sunrise, this.state.today.sunset, this.state.lat, this.state.lon);
        animateWeatherGFX(weather, this.state.weather.id, this.state.tz);
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
                    showError('Unable to reach weather service at this time. Please wait a few minutes, then refresh the page.');
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
                ['tz', data.timezone],
                ['forecast', data.daily]
            ]);
        });
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
        const loader = document.getElementById('loader');
    
        if(isLoaderAlreadyRunning && !loader.classList.contains('hidden')){
            return;
        }
    
        loader.classList.toggle('hidden');
    }

    async initialize(){

        // enable Loader while data is being fetched
        this.toggleLoader();
        

        await this.getLocationData()
        .then(data => {
            this.state.setMultipleProperties([
                ['lat', data.lat],
                ['lon', data.lon]
            ]);
        })
        .then(async () => {
            await Geocoding.reverseGeocode(this.state.lat, this.state.lon, config.GOOGLE_API_KEY)
            .then(data => this.state.location = data);
        })
        .then(async () => {
            await this.updateWeatherData()
            .then(() => {
                // rerender DOM with updated state and disable Loader
                this.render();
                this.toggleLoader();
            })
        })
        .catch(error => console.error(error));
    }
}

export default WeatherApp;

