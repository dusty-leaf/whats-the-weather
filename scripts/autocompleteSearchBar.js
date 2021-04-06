import config from './config.js';

const autocompleteSearchBar  = () => {
    const searchbar = document.getElementById('search');

    const  options = {
        types: ['(cities)'],
    };
    
    const autocomplete = new google.maps.places.Autocomplete(searchbar, options);
    
    google.maps.event.clearInstanceListeners(searchbar);
    google.maps.event.addListener(autocomplete, 'place_changed', function(){
            let place = autocomplete.getPlace();
            console.log(place);
    });
}

const googleapis = document.getElementById('googleapis');
googleapis.src = `https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_API_KEY}&libraries=places`
googleapis.addEventListener('load', () => {
    autocompleteSearchBar();
});


export default autocompleteSearchBar;