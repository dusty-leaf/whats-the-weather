class ErrorHandler {
    static root = document.getElementsByClassName('js-error')[0];

    static showError(str){
        console.log(str);
        this.root.innerHTML = `<p>${str}</p>`;
    }

    static clearError(){
        showError('');
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