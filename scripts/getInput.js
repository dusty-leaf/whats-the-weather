// country codes
const countryCodes = Object.keys(countryListAlpha2); //bad no work
const countryNames = Object.values(countryListAlpha2);
const countries = [];

for(let x = 0; x < countryCodes.length; x++){
    countries.push({ text: `${countryCodes[x]} - ${countryNames[x]}`, val: countryCodes[x]});
}