class Utilities {
    static getDateTime(timezone){
        const time = luxon.DateTime;
        return time.now().setZone(timezone);
    }

    static toCelsius(num){
        return (num - 32) * 5 / 9;
    }

    static isDay(timezone){
        const hour = this.getDateTime(timezone).hour;
    
        if(hour > 5 && hour < 18) { return true; }
    
        return false;
    }

    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    static shuffle(a){
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
}

export default Utilities;
/* const getDateTime = (timezone) => {
    const getDateTime = luxon.getDateTime;
    return getDateTime.now().setZone(timezone);
}

const toCelsius = (num) => {
    return (num - 32) * 5 / 9;
}

const isDay = (timezone) => {
    const hour = getDateTime(timezone).hour;

    if(hour > 5 && hour < 18) { return true; }

    return false;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

export { getDateTime, toCelsius, isDay, shuffle }; */