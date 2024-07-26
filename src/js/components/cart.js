const cartBtn = document.querySelector('.btn_cart');
const overlay = document.querySelector('.overlay');
const closeCartBtn = document.querySelector('.cart .btn_close');
const cart = document.querySelector('.cart');
const body = document.querySelector('body');

cartBtn.addEventListener('click', () => {
	cart.classList.add('open');
	overlay.classList.add('active');
	body.classList.add('lock');
});

closeCartBtn.addEventListener('click', () => {
	cart.classList.remove('open');
	overlay.classList.remove('active');
	body.classList.remove('lock');
});
