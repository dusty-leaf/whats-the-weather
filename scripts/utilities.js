const getDateTime = (timezone) => {
    const DateTime = luxon.DateTime;
    return DateTime.now().setZone(timezone);
}

const toCelsius = (num) => {
    return (num - 32) * 5 / 9;
}

const isDay = (timezone) => {
    const hour = getDateTime(timezone).hour;

    if(hour > 5 && hour < 18) { return true; }

    return false;
}

export { getDateTime, toCelsius, isDay };