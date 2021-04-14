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