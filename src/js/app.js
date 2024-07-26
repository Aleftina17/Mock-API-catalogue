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
import { initializeFilter, updateProducts } from './components/filter';
import { renderProducts } from './render'; 

(async function init() {
    try {
        const products = await fetchProducts();
        initializeSort();
        initializeFilter(products);
        updateProducts(products);
    } catch (error) {
        console.error('Initialization error:', error);
        renderProducts([]);
    }
})();
