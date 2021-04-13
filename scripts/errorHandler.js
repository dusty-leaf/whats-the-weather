class ErrorHandler {
    static rootElement = document.querySelector('.js-error');

    static showError(str){
        this.rootElement.innerHTML = `<p>${str}</p>`;
    }

    static clearError(){
        this.showError('');
    }
}

export default ErrorHandler;

/* const showError = (str) => {
    const error = document.getElementById('error');
    error.innerHTML = `<p>${str}</p>`;
}

const clearError = () => {
    showError('');
}

export { showError, clearError }; */