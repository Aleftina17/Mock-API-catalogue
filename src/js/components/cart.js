const cartBtn = document.querySelector('.btn_cart');
const overlay = document.querySelector('.overlay');
const closeCartBtn = document.querySelector('.cart .btn_close');
const cart = document.querySelector('.cart');
const body = document.querySelector('body');
const CART_KEY = 'cart';

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

export function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCart();
}

export function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCart();
}

export function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCart();
}

export function updateCart() {
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    renderCart(cart);
    updateCartCount(cart);
}

function renderCart(cart) {
    const cartContainer = document.querySelector('.cart_items');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<li class="cart_item">Корзина пуста</li>';
        document.querySelector('.cart_amount').textContent = '0 товара';
        document.querySelector('.cart_total .price').textContent = '0 ₽';
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
    initializeInputNumber();
}

function updateCartInfo(cart) {
    const cartAmount = document.querySelector('.cart_amount');
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    cartAmount.textContent = `${cart.length} товара(ов)`;
    document.querySelector('.cart_total .price').textContent = `${totalPrice} ₽`;
}

function updateCartCount(cart) {
    const cartCount = document.querySelector('.header .btn_cart span');
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalQuantity;
}

function initializeInputNumber() {
    document.querySelectorAll('.btn_plus, .btn_minus').forEach(button => {
        button.addEventListener('click', event => {
            const target = event.target;
            const cartItem = target.closest('.cart_item');
            const input = cartItem.querySelector('input[type="number"]');
            const productId = target.dataset.id;
            const isIncrement = target.classList.contains('btn_plus');

            let newQuantity = parseInt(input.value, 10) || 1;
            newQuantity = isIncrement ? newQuantity + 1 : newQuantity - 1;
            newQuantity = Math.max(newQuantity, 1);
            input.value = newQuantity;
            updateProductQuantity(productId, newQuantity);
        });
    });
}

function updateProductQuantity(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        cart[productIndex].quantity = quantity;
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCart();
    }
}

function handleAddToCart(button) {
    const productId = button.dataset.id;
    const product = window.products.find(p => p.id === productId);
    addToCart(product);
}

function handleRemoveFromCart(button) {
    const productId = button.dataset.id;
    removeFromCart(productId);
}

document.addEventListener('click', event => {
    const target = event.target;
    if (target.closest('.btn_add')) {
        handleAddToCart(target.closest('.btn_add'));
    }
    if (target.closest('.btn_remove')) {
        handleRemoveFromCart(target.closest('.btn_remove'));
    }
    if (target.closest('.btn_clear')) {
        clearCart();
    }
});
