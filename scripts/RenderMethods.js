import Utilities from './Utilities.js';

class RenderMethods {

    static getIcon(id, status, timezone){

        let clear;
        let clouds;
    
        if(Utilities.isDay(timezone)){
            clear = ['fas', 'fa-sun'];
            clouds = ['fas', 'fa-cloud-sun'];
        } else {
            clear = ['fas', 'fa-moon'];
            clouds = ['fas', 'fa-cloud-moon'];
        }
    
        switch(status){
            case 'Thunderstorm': return ['fas', 'fa-bolt']; 
            case 'Drizzle': return ['fas', 'fa-cloud-rain']; 
            case 'Rain': return ['fas', 'fa-cloud-showers-heavy']; 
            case 'Snow': return ['fas', 'fa-snowflake']; 
            case 'Mist':
            case 'Smoke':
            case 'Haze':
            case 'Dust':
            case 'Fog':
            case 'Sand':
            case 'Ash': 
            case 'Squall':
            case 'Tornado': return ['fas', 'fa-smog'];  //specific tornado icon availible with font-awesome pro
            case 'Clear': return clear;
            case 'Clouds': 
                if(Number.parseInt(id) < 803){
                    return  clouds;
                } else {
                    return ['fas', 'fa-cloud']
                };
            default: return ['fas', 'fa-cloud'];
        }
    }

    static displayWeather({id, weather, timezone}){
        const weatherIconElement = document.querySelector('.js-weatherIcon');
        
        // reset
        weatherIconElement.classList = 'weather__icon js-weatherIcon';

        const weatherStatusElement = document.querySelector('.js-weatherStatus');
        let classes = [];
    
        classes = this.getIcon(id, weather, timezone);
    
        classes.forEach(el => weatherIconElement.classList.add(el));
        weatherStatusElement.innerHTML = weather;
    }

    static displayTemperature({temperature, feels_like, max, min, unit}){
        let temperatures = [temperature, feels_like, max, min].map((el) => {
            if(unit === 'celsius'){
                el = Utilities.toCelsius(el);
            }
            return Math.round(el);
        });
    
        const deg = (unit === 'celsius') ? 'C' : 'F';

        const todayElement = document.querySelector('.js-today');
        todayElement.innerHTML = "Today's Forecast:";
        
        const temperatureElement = document.querySelector('.js-temperature');
        temperatureElement.innerHTML = `${temperatures[0]}&deg;${deg}`;
    
        const feelsLikeElement = document.querySelector('.js-feelsLike');
        feelsLikeElement.innerHTML = `Feels like ${temperatures[1]}&deg;${deg}`;
    
        const highTemperatureElement = document.querySelector('.js-highTemperature');
        highTemperatureElement.innerHTML = `High: ${temperatures[2]}&deg;${deg}`;
    
        const lowTemperatureElement = document.querySelector('.js-lowTemperature');
        lowTemperatureElement.innerHTML = `Low: ${temperatures[3]}&deg;${deg}`;
    }

    static displayForecast({forecast, unit}){
        const dailyForecasts = forecast.slice(1);
    
        const rootElement = document.querySelector('.js-forecast');
        while(rootElement.firstChild){
            rootElement.firstChild.remove();
        }

        const forecastTitleElement = document.createElement('h2');
        forecastTitleElement.classList.add('forecast__title');
        forecastTitleElement.innerText = '7 Day Forecast';
        rootElement.appendChild(forecastTitleElement);

        const forecastContainerElement = document.createElement('div');
        forecastContainerElement.classList.add('forecast__container');
        forecastTitleElement.appendChild(forecastContainerElement);
    
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let dayOfTheWeek = new Date().getUTCDay();
    
        dailyForecasts.forEach(el => {
            const max = (unit === 'celsius') ? Utilities.toCelsius(el.temp.max) : el.temp.max;
            const min = (unit === 'celsius') ? Utilities.toCelsius(el.temp.min) : el.temp.min;
            
            // one forecastSubcontainerElement for each day of the week
            const forecastSubcontainerElement = document.createElement('div');
            forecastSubcontainerElement.classList.add('forecast__subcontainer');
    
            const dayNameElement = document.createElement('p');
            dayOfTheWeek += 1;
            if(dayOfTheWeek < 7){
                dayNameElement.innerText = days[dayOfTheWeek];
            } else {
                dayOfTheWeek = 0;
                dayNameElement.innerText = days[dayOfTheWeek];
            }
            forecastSubcontainerElement.appendChild(dayNameElement);
    
            const iconElement = document.createElement('i');
            const iconClasses = this.getIcon(el.weather[0].id, el.weather[0].main);
            iconClasses.forEach(el => iconElement.classList.add(el));
            forecastSubcontainerElement.appendChild(iconElement);
    
            const highTemperatureElement = document.createElement('p');
            highTemperatureElement.innerHTML = `${Math.round(max)}&deg;`;
            forecastSubcontainerElement.appendChild(highTemperatureElement);
    
            const lowTemperatureElement = document.createElement('p');
            lowTemperatureElement.innerHTML = `${Math.round(min)}&deg;`;
            lowTemperatureElement.classList.add('forecast__container--low-temp');
            forecastSubcontainerElement.appendChild(lowTemperatureElement);
    
            forecastContainerElement.appendChild(forecastSubcontainerElement);
        });
    }

    static displayLocation({location}){
        const locationElement = document.querySelector('.js-location');
        const locationArr = location.toLowerCase().split(' ');

        if(locationArr.length === 1){
            locationElement.innerHTML = `${location[0].toUpperCase()}${location.slice(1)}`;
            return;
        }

        const capitalized = locationArr.map(el => el[0].toUpperCase() + el.substring(1));
        locationElement.innerHTML = `${capitalized.join(' ')}`;
    }

    static displayDate({timezone}){
        const dateElement = document.querySelector('.js-date');
        dateElement.innerText = `${Utilities.getDateTime(timezone).toFormat("cccc',' LLLL d")}`;
    }

    static displayTime({timezone, clockElement}){
        const DateTime = luxon.DateTime;
        clockElement.innerHTML = Utilities.getDateTime(timezone).toLocaleString(DateTime.TIME_WITH_SECONDS);
    }
}

export default RenderMethods;