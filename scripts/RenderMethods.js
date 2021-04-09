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

    // this.state.current.weather[0].id, this.state.weather, this.state.timezone
    static displayWeather({id, weather, timezone}){
        const uiWeatherIcon = document.getElementById("weather-icon");
        uiWeatherIcon.classList.remove(...uiWeatherIcon.classList)
        const uiWeatherStatus = document.getElementById("weather-status");
        let classes = [];
    
        classes = this.getIcon(id, weather, timezone);
    
        classes.forEach(el => uiWeatherIcon.classList.add(el));
        uiWeatherStatus.innerHTML = weather;
    }

    static displayTemperature({temperature, feels_like, max, min, unit}){

        //const unit = getLS('unit');
    
        let temps = [temperature, feels_like, max, min].map((el) => {
            if(unit === 'celsius'){
                el = Utilities.toCelsius(el);
            }
            return Math.round(el);
        });
    
        const deg = (unit === 'celsius') ? 'C' : 'F';
        
        const uiTemperature = document.getElementById("temperature");
        uiTemperature.innerHTML = `${temps[0]}&deg;${deg}`;
    
        const uiFeelsLike = document.getElementById("feelslike");
        uiFeelsLike.innerHTML = `Feels like ${temps[1]}&deg;${deg}`;
    
        const high = document.getElementById("high");
        high.innerHTML = `High: ${temps[2]}&deg;${deg}`;
    
        const low = document.getElementById("low");
        low.innerHTML = `Low: ${temps[3]}&deg;${deg}`;
    }

    static displayForecast({forecast, unit}){
        const temps = forecast.slice(1);
        //const unit = getLS('unit');
    
        const root = document.getElementById('weather-forecast');
        while(root.firstChild){
            root.firstChild.remove();
        }
    
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let dayOfTheWeek = new Date().getUTCDay();
    
    
        temps.forEach(el => {
            const max = (unit === 'celsius') ? Utilities.toCelsius(el.temp.max) : el.temp.max;
            const min = (unit === 'celsius') ? Utilities.toCelsius(el.temp.min) : el.temp.min;
            
            const day = document.createElement('div');
            day.classList.add('forecast__container');
    
            const name = document.createElement('p');
            dayOfTheWeek += 1;
            if(dayOfTheWeek < 7){
                name.innerText = days[dayOfTheWeek];
            } else {
                dayOfTheWeek = 0;
                name.innerText = days[dayOfTheWeek];
            }
            day.appendChild(name);
    
            const icon = document.createElement('i');
            const iconClasses = this.getIcon(el.weather[0].id, el.weather[0].main);
            iconClasses.forEach(el => icon.classList.add(el));
            day.appendChild(icon);
    
            const high = document.createElement('p');
            high.innerHTML = `${Math.round(max)}&deg;`;
            day.appendChild(high);
    
            const low = document.createElement('p');
            low.innerHTML = `${Math.round(min)}&deg;`;
            low.classList.add('forecast__container--low');
            day.appendChild(low);
    
            root.appendChild(day);
        });
    }

    static displayLocation({location}){
        const uiLocation = document.getElementById('location');
        const locationArr = location.toLowerCase().split(' ');
        if(locationArr.length === 1){
            uiLocation.innerHTML = `${location[0].toUpperCase()}${location.slice(1)}`;
            return;
        }
        const capitalized = locationArr.map(el => el[0].toUpperCase() + el.substring(1));
        uiLocation.innerHTML = `${capitalized.join(' ')}`;
    }

    static displayDate({timezone}){
        const uiDate = document.getElementById('date');
        uiDate.innerText = `${Utilities.getDateTime(timezone).toFormat("cccc',' LLLL d")}`;
    }

    static displayClock({timezone, clockInterval}){
    
        const DateTime = luxon.DateTime;
        const clock = document.getElementById("clock");
    
        const getTime = () => { return Utilities.getDateTime(timezone).toLocaleString(DateTime.TIME_WITH_SECONDS); }
        
        clock.innerText = `${getTime()}`;
    
        if(clockInterval){ clearInterval(clockInterval); }
    
        clockInterval = setInterval(() => { clock.innerText = `${getTime()}`; }, 1000);
           
    };
}

export default RenderMethods;