import countryList from './countryCodes.js';
import { updateLS } from './LS.js';

const searchBar = () => {
    
    const uiSearchBar = document.getElementById('search');
    let query = '';

    uiSearchBar.addEventListener('keyup', (e) => {
        query = e.target.value;
    });
    

}

export default searchBar;
