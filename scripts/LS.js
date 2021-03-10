const setLS = (arr) => {
    arr.forEach(el => {
        window.localStorage.setItem(el.key, el.value);
    })
    
}

const getLS = (key) => {
    return window.localStorage.getItem(key);
}

export { setLS, getLS };