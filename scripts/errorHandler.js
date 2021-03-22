const showError = (str) => {
    const error = document.getElementById('error');
    error.innerHTML = `<p>${str}</p>`;
}

const clearError = () => {
    showError('');
}

export { showError, clearError };