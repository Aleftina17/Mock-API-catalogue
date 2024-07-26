const overlay = document.querySelector('.overlay');
const body = document.querySelector('body');
const cart = document.querySelector('.cart');
const sort = document.querySelector('.sort')

overlay.addEventListener('click', () => {
	body.classList.remove('lock');

	if (cart.classList.contains('open')) {
		cart.classList.remove('open');
		overlay.classList.remove('active');
	}

    if (sort.classList.contains('open')) {
		sort.classList.remove('open');
		overlay.classList.remove('active');
	}


});