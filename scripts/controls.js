import { displayForecast, displayTemperature } from "./displayUI.js";
import { getLS, setLS } from "./LS.js";

const settingsButtons = Array.from(document.getElementsByClassName('settings__button'));
const icon = document.getElementById('settings__icon');

settingsButtons.forEach(el => {
    el.addEventListener('mouseover', () => {
        icon.className = `fas fa-${el.id}`;
    });
});

settingsButtons.forEach(el => {
    el.addEventListener('mouseout', () => {
        icon.className = 'fas fa-cloud-sun';
    });
});

const toggleHidden = (element) => {
    element.classList.toggle('hidden');
}

const toggleDisplayUnits = () => {
    const farenheitButton = document.getElementById('F');
    const celsiusButton = document.getElementById('C');

    const updateDisplayUnits = () => {
        displayTemperature(getLS('current'), getLS('feelslike'), getLS('max'), getLS('min'));
        displayForecast(JSON.parse(getLS('forecast')));
    }

    farenheitButton.addEventListener('click', () => {
        setLS([{key: 'unit', value: 'imperial'}]);
        updateDisplayUnits();
        toggleHidden(farenheitButton);
        toggleHidden(celsiusButton);
        // farenheitButton.classList.toggle('hidden');
        // celsiusButton.classList.toggle('hidden');
    });

    celsiusButton.addEventListener('click', () => {
        setLS([{key: 'unit', value: 'celsius'}]);
        updateDisplayUnits();
        toggleHidden(farenheitButton);
        toggleHidden(celsiusButton);
        // farenheitButton.classList.toggle('hidden');
        // celsiusButton.classList.toggle('hidden');
    });
}

const toggleLoader = (isLoaderAlreadyRunning) => {
    const loader = document.getElementById('loader');

    if(isLoaderAlreadyRunning && !loader.classList.contains('hidden')){
        return;
    }

    loader.classList.toggle('hidden');
}



export { toggleDisplayUnits, toggleLoader, toggleHidden };