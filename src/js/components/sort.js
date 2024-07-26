import { applyFiltersAndSort } from './filter';

const sort = document.querySelector('.sort');
const sortTop = document.querySelector('.sort_top');
const sortDropdown = document.querySelector('.sort_dropdown');
const sortItems = document.querySelectorAll('.sort_dropdown__item');
const sortTopSpan = sortTop.querySelector('span');
const body = document.querySelector('body');
const overlay = document.querySelector('.overlay');

let currentSortOption = 'Сначала дорогие';

export function initializeSort() {
	sortTop.addEventListener('click', () => {
		sort.classList.add('open');
		overlay.classList.add('active');
		body.classList.add('lock');
	});

	sortItems.forEach(item => {
		item.addEventListener('click', () => {
			sortItems.forEach(i => i.classList.remove('active'));
			item.classList.add('active');
			sortTopSpan.textContent = item.textContent;
			sort.classList.remove('open');
			overlay.classList.remove('active');
			body.classList.remove('lock');

			const option = item.textContent;
			updateSortOption(option);
		});
	});
}

export function updateSortOption(option) {
	currentSortOption = option;
	applyFiltersAndSort();
}

export function applySort(products) {
	switch (currentSortOption) {
		case 'Сначала дорогие':
			return products.sort((a, b) => b.price - a.price);
		case 'Сначала недорогие':
			return products.sort((a, b) => a.price - b.price);
		case 'Сначала популярные':
			return products.sort((a, b) => b.amount - a.amount);
		case 'Сначала новые':
			return products.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
		default:
			return products;
	}
}
