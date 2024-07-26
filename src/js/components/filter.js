import { renderProducts } from './../render';
import { applySort } from './sort';

const overlay = document.querySelector('.overlay');
const body = document.querySelector('body');
const filter = document.querySelector('.catalogue_filter');
const filterBtn = document.querySelector('.btn_filter');
const checkboxes = document.querySelectorAll('.catalogue_filter__item input[type="checkbox"]');

let products = [];
let filterOption = {};

export function initializeFilter(initialProducts) {
	products = initialProducts;

	filterBtn.addEventListener('click', () => {
		filter.classList.add('open');
		overlay.classList.add('active');
		body.classList.add('lock');
	});

	overlay.addEventListener('click', () => {
		filter.classList.remove('open');
		overlay.classList.remove('active');
		body.classList.remove('lock');
	});

	checkboxes.forEach(checkbox => {
		checkbox.addEventListener('change', () => {
			filterOption[checkbox.id] = checkbox.checked;
			applyFiltersAndSort();
		});
	});

	applyFiltersAndSort();
}

export function applyFiltersAndSort() {
	let filteredProducts = products;

	if (filterOption['toggle-new']) {
		filteredProducts = filteredProducts.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate)).slice(0, 6);
	}

	if (filterOption['toggle-in-stock']) {
		filteredProducts = filteredProducts.filter(product => product.amount > 0);
	}

	if (filterOption['toggle-contract']) {
		filteredProducts = filteredProducts.filter(product => product.isContract);
	}

	if (filterOption['toggle-exclusive']) {
		filteredProducts = filteredProducts.filter(product => product.isExclusive);
	}

	if (filterOption['toggle-sale']) {
		filteredProducts = filteredProducts.filter(product => product.isOnSale);
	}

	filteredProducts = applySort(filteredProducts);
	renderProducts(filteredProducts);
}

export function updateProducts(newProducts) {
	products = newProducts;
	applyFiltersAndSort();
}
