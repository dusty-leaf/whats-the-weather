class ErrorHandler {
    constructor(root){
        this.root = root;
    }

    showError(str){
        console.log(str);
        this.root.innerHTML = `<p>${str}</p>`;
    }

    clearError(){
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