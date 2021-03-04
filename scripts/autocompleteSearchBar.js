const autocompleteSearchBar  = () => {
    const searchbar = document.getElementById('search');

    const  options = {
        types: ['(cities)'],
    };
    
    const autocomplete = new google.maps.places.Autocomplete(searchbar, options);
    
    google.maps.event.clearInstanceListeners(searchbar);
    google.maps.event.addListener(autocomplete, 'place_changed', function(){
            let place = autocomplete.getPlace();
    });
}

export default autocompleteSearchBar;