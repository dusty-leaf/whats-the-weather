import { displayClock, displayForecast, displayTemperature } from "./displayUI.js";
import { getLS, setLS } from "./LS.js";

const controls = () => {
    const farenheitButton = document.getElementById('F');
    const celsiusButton = document.getElementById('C');

    const toggleDisplayUnits = () => {
        displayTemperature(getLS('current'), getLS('feelslike'), getLS('max'), getLS('min'));
        displayForecast(JSON.parse(getLS('forecast')));
    }

    farenheitButton.addEventListener('click', () => {
        setLS([{key: 'unit', value: 'imperial'}]);
        toggleDisplayUnits();
    });

    celsiusButton.addEventListener('click', () => {
        setLS([{key: 'unit', value: 'celsius'}]);
        toggleDisplayUnits();
    });
}

export default controls;