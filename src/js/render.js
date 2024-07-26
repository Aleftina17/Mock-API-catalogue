const catalogueListGrid = document.querySelector('.catalogue_list__grid');

export function renderProducts(products) {
	catalogueListGrid.innerHTML = '';

	if (products.length === 0) {
		catalogueListGrid.classList.add('empty');
		catalogueListGrid.innerHTML = '<span>Товары не найдены</span>';
	} else {
		catalogueListGrid.classList.remove('empty');
		products.forEach(product => {
			const productCard = document.createElement('a');
			productCard.href = '#!';
			productCard.classList.add('catalogue-card');
			productCard.innerHTML = `
                <div class="catalogue-card_img">
                    <img class="img-front" src="${product.images.front}" alt="${product.title}" />
                    <img class="img-back" src="${product.images.back}" alt="${product.title}-demo" />
                </div>
                <div class="catalogue-card_info">
                    <div class="catalogue-card_title">${product.title}</div>
                    <div class="catalogue-card_info__bottom">
                        <div class="catalogue-card_price">${product.price} ₽</div>
                        <button class="btn btn_add" data-id="${product.id}">
                            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 4.16663V15.8333" stroke="#1F2020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M4.16699 10H15.8337" stroke="#1F2020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            `;
			catalogueListGrid.appendChild(productCard);
		});
	}
}
