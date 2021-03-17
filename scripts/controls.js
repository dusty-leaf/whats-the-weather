import { displayForecast, displayTemperature } from "./displayUI.js";
import { getLS, setLS } from "./LS.js";

const updateDisplayUnits = () => {
    const farenheitButton = document.getElementById('F');
    const celsiusButton = document.getElementById('C');

    const toggleDisplayUnits = () => {
        displayTemperature(getLS('current'), getLS('feelslike'), getLS('max'), getLS('min'));
        displayForecast(JSON.parse(getLS('forecast')));
    }

    farenheitButton.addEventListener('click', () => {
        setLS([{key: 'unit', value: 'imperial'}]);
        toggleDisplayUnits();
        farenheitButton.classList.toggle('hidden');
        celsiusButton.classList.toggle('hidden');
    });

    celsiusButton.addEventListener('click', () => {
        setLS([{key: 'unit', value: 'celsius'}]);
        toggleDisplayUnits();
        farenheitButton.classList.toggle('hidden');
        celsiusButton.classList.toggle('hidden');
    });
}

const toggleLoader = (checkIfLoaderIsAlreadyRunning) => {
    const loader = document.getElementById('loader');

    if(checkIfLoaderIsAlreadyRunning && !loader.classList.contains('hidden')){
        return;
    }

    loader.classList.toggle('hidden');
}

export { updateDisplayUnits, toggleLoader };