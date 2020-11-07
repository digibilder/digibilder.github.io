
(() => {
    const formElement = document.querySelector('[id="formElement"]');
    const successMessage = formElement.querySelector('[id="success-message"]')
    const errorMessage = formElement.querySelector('[id="error-message"]')
    const submitButton = formElement.querySelector('button[type="submit"]');
    
    window.enableSubmitButtonCallback = function() {
        submitButton.removeAttribute('disabled');
    };

    
    formElement.onsubmit = async (e) => {
        e.preventDefault();
        fetch('https://getform.io/f/1f6033e2-7ce1-4cda-90e0-c5f625dcf093', {
            method: 'POST',
            body: new FormData(formElement)
        }).then((response) => {
            if (!response.ok) {
                throw new Error(response);
            }
            successMessage.classList.remove('hidden');
            errorMessage.classList.add('hidden');
        }).catch((err) => {
            successMessage.classList.add('hidden');
            errorMessage.classList.remove('hidden');
        });
      };
})()