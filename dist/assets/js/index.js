const toggleErrorMessages = document.getElementById('toggle-error-messages');

toggleErrorMessages.addEventListener('click', (e) => {
    const errorMessages = document.querySelectorAll('.error-message');
    [...errorMessages].forEach((errorMessage) => {
        const displayType = errorMessage.style.display;
        errorMessage.style.display = (displayType === 'block') ? 'none' : 'block';
    });
});

const showInnerWidth = function() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    const div = document.querySelector('.inner-width');
    div.innerHTML = `Screen size: ${width}x${height}`;
}

showInnerWidth();

window.addEventListener('resize', () => {
    showInnerWidth();
});