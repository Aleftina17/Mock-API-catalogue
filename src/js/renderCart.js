// renderCart.js

const cartContainer = document.querySelector('.cart_items');

// Отображение товаров в корзине
export function renderCart(cart) {
    cartContainer.innerHTML = ''; // Очистить контейнер

    if (cart.length === 0) {
        cartContainer.innerHTML = '<li class="cart_item">Корзина пуста</li>';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.classList.add('cart_item');
        cartItem.innerHTML = `
            <div class="cart_item__img">
                <img src="${item.images.front}" alt="${item.title}" />
            </div>
            <div class="cart_item__info">
                <span class="cart_item__title">${item.title}</span>
                <span class="cart_item__price">${item.price} ₽</span>
            </div>
            <div class="cart_item__amount input-number">
                <button class="btn_minus" data-id="${item.id}">-</button>
                <input type="number" value="${item.quantity}" min="1" max="999" />
                <button class="btn_plus" data-id="${item.id}">+</button>
            </div>
            <button class="btn_remove" data-id="${item.id}">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="1">
                        <path d="M18 6L6 18" stroke="#1F2020" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6 6L18 18" stroke="#1F2020" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                </svg>
            </button>
        `;
        cartContainer.appendChild(cartItem);
    });

    updateCartInfo(cart);
}

// Обновление информации о корзине
function updateCartInfo(cart) {
    const cartAmount = document.querySelector('.cart_amount');
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    
    cartAmount.textContent = `${cart.length} товара(ов)`;
    document.querySelector('.cart_total .price').textContent = `${totalPrice} ₽`;
}
