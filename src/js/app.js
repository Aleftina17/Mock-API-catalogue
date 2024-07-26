import 'swiper/css';
import 'swiper/css/bundle';
import '../scss/index.scss';
import './components/overlay'
import './components/cart'
import './components/sort'
import './components/filter'
import './api'
import './render'
import './pages/catalogue';

import { fetchProducts } from './api';
import { initializeSort } from './components/sort';
import { initializeFilter } from './components/filter';
import { renderProducts } from './render'; 
import { updateCart } from './components/cart';

window.products = [];

(async function init() {
    try {
        window.products = await fetchProducts();
        initializeSort(window.products);
        initializeFilter(window.products);
        renderProducts(window.products);
        updateCart();
    } catch (error) {
        console.error('Initialization error:', error);
        renderProducts([]);
    }
})();