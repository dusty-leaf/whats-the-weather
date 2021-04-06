import config from './config.js';

const getWeather = (state) => new Promise(
    (resolve, reject) => {
    //const query = getLS('zip') ? `zip=${getLS('zip')}` : `q=${getLS('city')},${getLS('country')}`;
    // https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.API_KEY}&units=imperial
    // https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.API_KEY}&units=imperial
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${state.lat}&lon=${state.lon}&exclude=minutely,hourly&appid=${config.OPENWEATHER_API_KEY}&units=imperial`)
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
});

// updateWeather fetches fresh weather data every 60 seconds
// (in sync with background animations)
// updateTimeRemeainingInCycle saves the number of ms elapsed since
// the start of the cycle (in 100ms increments) in case the app is paused,
// after which the refreshData is called again with the remaining time
// (psuedo-pause/resume)

const updateWeather = (state, wasPaused) => {
    
    if(!wasPaused){ state.timeRemainingInCycle = 60000; }

    state.refreshData = setTimeout(() => {
        getWeather(state.lat, state.lon)
        .then((data) => {
            state.setMultipleProperties([
                ['weather', data.current.weather[0].main],
                ['current', data.current],
                ['today', data.daily[0]],
                ['tz', data.timezone],
                ['forecast', data.daily]
            ]);
            updateDOM(state);
            clearInterval(state.updateTimeRemainingInCycle);
            updateWeather(state.lat, state.lon);
        });
    }, state.timeRemainingInCycle);

    state.updateTimeRemainingInCycle = setInterval(() => {
        state.timeRemainingInCycle  -= 100;
        if(state.timeRemainingInCycle  <= 0){
            clearInterval(state.updateTimeRemainingInCycle);
        }
    }, 100);
    
}


export { getWeather, updateWeather };