import { animateWeatherGFX, animateSky, toggleParticleAnimations } from './animations.js';
import { toggleIsPaused, toggleAppPause } from './controls.js';

const menu = (state) => {
    const rainBtn = document.getElementById('cloud-rain');
    const stormBtn = document.getElementById('bolt');
    const snowBtn = document.getElementById('snowflake');
    const fogBtn = document.getElementById('smog');

    const menuBtns = [rainBtn, stormBtn, snowBtn, fogBtn];
    menuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            state.setProperty('toggledWeather', btn.dataset.weather);
            animateSky(state.toggledWeather, state.today.sunrise, state.today.sunset, state.lat, state.lon);
            animateWeatherGFX(state.toggledWeather, state.weather.id, state.tz);
            toggleParticleAnimations();
            toggleAppPause(state);
        });
    });
}

export default menu;