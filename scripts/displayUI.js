import { getLS } from "./LS.js";

// WEATHER
const toCelsius = (num) => {
    return (num - 32) * 5 / 9;
}

const getIcon = (id, status) => {
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
        case 'Clear': return ['fas', 'fa-sun'];
        case 'Clouds': 
            if(Number.parseInt(id) < 803){
                return ['fas', 'fa-cloud-sun'] ;
            } else {
                return ['fas', 'fa-cloud']
            };
        default: return ['fas', 'fa-cloud'];
    }
}

const displayWeather = (id, status) => {
    const uiWeatherIcon = document.getElementById("weather-icon");
    const uiWeatherStatus = document.getElementById("weather-status");
    let classes = [];

    classes = getIcon(id, status);

    classes.forEach(el => uiWeatherIcon.classList.add(el));
    uiWeatherStatus.innerHTML = status;
}

// TEMPERATURE 

const displayTemperature = (temperature, feelslike, highTemp, lowTemp) => {

    const unit = getLS('unit');

    let temps = [temperature, feelslike, highTemp, lowTemp].map((el) => {
        if(unit === 'celsius'){
            el = toCelsius(el);
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

// FORECAST

const displayForecast = (forecast) => {
    const temps = forecast.slice(1);
    const unit = getLS('unit');

    const root = document.getElementById('weather-forecast');
    while(root.firstChild){
        root.firstChild.remove();
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let dayOfTheWeek = new Date().getUTCDay();


    temps.forEach(el => {
        const max = (unit === 'celsius') ? toCelsius(el.temp.max) : el.temp.max;
        const min = (unit === 'celsius') ? toCelsius(el.temp.min) : el.temp.min;
        
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
        const iconClasses = getIcon(el.weather[0].id, el.weather[0].main);
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

// LOCATION 

const displayLocation = (location) => {
    const uiLocation = document.getElementById('location');
    uiLocation.innerHTML = `${location.charAt(0)}${location.slice(1).toLowerCase()}`;
}

// DATE

const displayDate = () => {
    const uiDate = document.getElementById('date');
    uiDate.innerText = new Date().toDateString();
}

// CLOCK

const displayClock = () => {
    const uiClock = document.getElementById("clock");
    const updateClock = () => {
        uiClock.innerHTML = `${new Date().toLocaleTimeString()}`;
    };
    
    setInterval(updateClock, 1000);
}

export { displayWeather, displayTemperature, displayForecast, displayLocation, displayDate, displayClock };