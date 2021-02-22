const updateLS = (key, value) => {
    window.localStorage.setItem(key, value);
}

const getLS = (key) => {
    return window.localStorage.getItem(key);
}

export { updateLS, getLS };