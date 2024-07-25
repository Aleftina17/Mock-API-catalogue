import Swiper from 'swiper/bundle';

const swiper = new Swiper('.catalogue_swiper', {
	pagination: {
		el: '.swiper-pagination',
		clickable: true
	},
	navigation: {
		nextEl: '.swiper-button-next',
	},
	slidesPerView: 1,
	loop: true
});