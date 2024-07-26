import axios from 'axios';

const API_URL = 'https://66a372f944aa63704581383b.mockapi.io/api/catalogue/products';

export async function fetchProducts() {
	try {
		const response = await axios.get(API_URL);
		return response.data;
	} catch (error) {
		console.error('Error fetching products:', error);
		return [];
	}
}
