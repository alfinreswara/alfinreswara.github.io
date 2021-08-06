const buttom = document.getElementById('Darkmode');
const html = document.querySelector('html');

buttom.addEventListener('click', function(){
    setTimeout(() => {
    if(html.dataset.colorMode === 'light'){
        html.dataset.colorMode = 'dark';
        this.classList.replace('bi-moon-stars-fill', 'bi-moon-fill');
    } else {
        html.dataset.colorMode = 'light';
        this.classList.replace('bi-moon-fill', 'bi-moon-stars-fill');
    }
},500);
});

const nama = document.querySelector('.alfin');
const huruf = [...nama.textContent].map(h => `<span>${h}</span>`).join('');
nama.innerHTML = huruf;



const scriptURL = 'https://script.google.com/macros/s/AKfycbwaSRNaOcMI3zEIi92j91hWrh3gzFhzjq5hpzQPk2xTwF7xhkJJRZQaugg3mzvjvlL_/exec'
const form = document.forms['Portfolio-contact-form'];
const btnKirm = document.querySelector('.btn-kirim');
const btnLoading = document.querySelector('.btn-loading');
const myAlert = document.querySelector('.my-alert');

form.addEventListener('submit', e => {
  e.preventDefault()
  // saat loading
  btnLoading.classList.toggle('d-none');
  btnKirm.classList.toggle('d-none');
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
  .then(response => {
    // menampilkan kirim
    btnLoading.classList.toggle('d-none');
    btnKirm.classList.toggle('d-none');
  // menampilkan alert
    myAlert.classList.toggle('d-none');
  // reset form
    form.reset();
    console.log('Success!', response)})
  .catch(error => console.error('Error!', error.message))
})