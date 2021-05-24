'use strict';
import key from '../config.js';

class AutocompleteSearchBar {
    constructor(searchBar, googleScript, options){
        this.searchBar = searchBar;
        this.googleScript = googleScript;
        this.options =  options;
        this.googleScript = googleScript;
        this.googleScript.src = 'https://radiant-lowlands-59230.herokuapp.com/api';
        this.googleScript.addEventListener('load', () => {
            this.autocomplete = new google.maps.places.Autocomplete(this.searchBar, this.options);
            google.maps.event.clearInstanceListeners(this.searchBar);
            google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
                let place = this.autocomplete.getPlace();
            });
        });
    }
}

export default AutocompleteSearchBar;