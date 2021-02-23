import countryList from './countryCodes.js';
import { updateLS } from './LS.js';

const searchBar = () => {
    
    const uiSearchBar = document.getElementById('search');
    const input = uiSearchBar.value.toUpperCase().split(',');
    // remove spaces
    input[1] = input[1].replace(/\s+/g, '');

    
    // input[0] = side before comma; it's the city name, so update LS with it
    updateLS('city', input[0]);

    // input[1] os the side after the comma 
    // it is either a zip code or country code
    // if input[1] is a number, then it is a zip code
    if(Number.parseInt(input[1])){
        updateLS('zip', input[1]);
    } else if (input[1].length === 2) {
        // if it's not a number and is only two characters long,
        // then it's a country code

        // need to validate
        updateLS('country', input[1]);
    } else {
        console.error(`Invalid country code: ${input[1]} not recognized.`);
    }

    uiSearchBar.reset();
    

}

export default searchBar;
