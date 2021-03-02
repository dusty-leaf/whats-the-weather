// WEATHER

const displayWeather = (id, status) => {
    const uiWeatherIcon = document.getElementById("weather-icon");
    const uiWeatherStatus = document.getElementById("weather-status");
    let classes = [];

    switch(status){
        case 'Thunderstorm': classes = ['fas', 'fa-bolt']; break;
        case 'Drizzle': classes = ['fas', 'fa-cloud-rain']; break;
        case 'Rain': classes = ['fas', 'fa-cloud-showers-heavy']; break;
        case 'Snow': classes = ['fas', 'fa-snowflake']; break;
        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Dust':
        case 'Fog':
        case 'Sand':
        case 'Ash': 
        case 'Squall':
        case 'Tornado': classes = ['fas', 'fa-smog']; break; //specific tornado icon availible with font-awesome pro
        case 'Clear': classes = ['fas', 'fa-sun']; break;
        case 'Clouds': Number.parseInt(id) < 803 ? classes = ['fas', 'fa-cloud-sun'] : classes = ['fas', 'fa-cloud']; break;
        default: classes = ['fas', 'fa-cloud'];
    }

    classes.forEach(el => uiWeatherIcon.classList.add(el));
    uiWeatherStatus.innerHTML = status;
}

// TEMPERATURE 

const displayTemperature = (temperature, feelslike, highTemp, lowTemp) => {
    const temps = arguments.forEach(el => Math.round(el));
    const uiTemperature = document.getElementById("temperature");
    uiTemperature.innerHTML = `${temps[0]}&deg;F`;

    const uiFeelsLike = document.getElementById("feelslike");
    uiFeelsLike.innerHTML = `Feels like ${temps[1]}&deg;F`;

    const high = document.getElementById("high");
    high.innerHTML = `High: ${temps[2]}&deg;F`;

    const low = document.getElementById("low");
    low.innerHTML = `Low: ${temps[3]}&deg;F`;
}

// LOCATION 

const displayLocation = (location) => {
    const uiLocation = document.getElementById('location');
    uiLocation.innerHTML = location;
}

// CLOCK

const displayClock = () => {
    const uiClock = document.getElementById("clock");
    const updateClock = () => {
        uiClock.innerHTML = `${new Date().toLocaleTimeString()}`;
    };
    
    setInterval(updateClock, 1000);
}

export { displayWeather, displayTemperature, displayLocation, displayClock };