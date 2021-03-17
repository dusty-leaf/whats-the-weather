const showError = (str) => {
    const error = document.getElementById('error');
    error.innerHTML = `${str}`;
}

const clearError = () => {
    showError('');
}

export { showError, clearError };