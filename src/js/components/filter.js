const overlay = document.querySelector('.overlay');
const body = document.querySelector('body');
const filter = document.querySelector('.catalogue_filter')
const filterBtn = document.querySelector('.btn_filter')

filterBtn.addEventListener('click', () => {
	filter.classList.add('open');
	overlay.classList.add('active');
	body.classList.add('lock');
});