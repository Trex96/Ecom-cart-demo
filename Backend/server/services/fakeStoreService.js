const axios = require('axios');


let cachedProducts = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Sample products to use when external API is unavailable
const sampleProducts = [
  {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    price: 109.95,
    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png"
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts",
    price: 22.3,
    description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"
  },
  {
    id: 3,
    title: "Mens Cotton Jacket",
    price: 55.99,
    description: "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"
  },
  {
    id: 4,
    title: "Mens Casual Slim Fit",
    price: 15.99,
    description: "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg"
  },
  {
    id: 5,
    title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    price: 695,
    description: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg"
  }
];

const axiosInstance = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://fakestoreapi.com',
    'Origin': 'https://fakestoreapi.com',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  }
});

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return Promise.resolve({ 
      status: error.response ? error.response.status : 0, 
      data: null,
      error: error.message 
    });
  }
);

const fetchFromFakeStore = async () => {
  try {
    console.log('Fetching from Fake Store API: /products');
    
    const response = await axiosInstance.get('/products');
    
    console.log('Received data from Fake Store API, length:', response.data ? response.data.length : 0);
    console.log('Response status code:', response.status);
    
    // Check if we got a successful response
    if (response.status === 200 && response.data) {
      console.log('Successfully fetched products, count:', response.data.length);
      return response.data;
    } else {
      console.error('Received non-200 status code or no data from Fake Store API:', response.status);
      return sampleProducts;
    }
  } catch (error) {
    console.error('Error fetching from Fake Store API:', error.message);
    // Return sample products as fallback
    return sampleProducts;
  }
};

const fetchSingleFromFakeStore = async (id) => {
  try {
    console.log('Fetching single product from Fake Store API:', `/products/${id}`);
    
    const response = await axiosInstance.get(`/products/${id}`);
    
    console.log('Received single product data from Fake Store API, length:', response.data ? response.data.length : 0);
    console.log('Response status code:', response.status);
    
    // Check if we got a successful response
    if (response.status === 200 && response.data) {
      console.log('Successfully fetched single product:', response.data.id);
      return response.data;
    } else {
      console.error('Received non-200 status code or no data from Fake Store API:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching single product from Fake Store API:', error.message);
    return null;
  }
};

const transformProducts = (fakeStoreProducts) => {
  console.log('Transforming Fake Store products, input count:', fakeStoreProducts.length);
  const result = fakeStoreProducts.map((product) => ({
    id: 1000 + product.id, // Use the actual product ID from Fake Store API
    name: product.title,
    price: product.price,
    description: product.description,
    image: product.image,
    category: product.category,
    stock: Math.floor(Math.random() * 100) + 1 
  }));
  console.log('Transformation complete, output count:', result.length);
  return result;
};

const transformSingleProduct = (fakeStoreProduct) => {
  return {
    id: 1000 + fakeStoreProduct.id, // Use the actual product ID from Fake Store API
    name: fakeStoreProduct.title,
    price: fakeStoreProduct.price,
    description: fakeStoreProduct.description,
    image: fakeStoreProduct.image,
    category: fakeStoreProduct.category,
    stock: Math.floor(Math.random() * 100) + 1
  };
};

const getFakeStoreProducts = async () => {
  const now = Date.now();
  
  console.log('Checking cache for Fake Store products');

  if (cachedProducts && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('Returning cached Fake Store products, count:', cachedProducts.length);
    return cachedProducts;
  }
  
  try {
    console.log('Fetching fresh Fake Store products');
    
    const fakeStoreProducts = await fetchFromFakeStore();
    const transformedProducts = transformProducts(fakeStoreProducts);
    
    console.log('Transformed Fake Store products, count:', transformedProducts.length);

    cachedProducts = transformedProducts;
    cacheTimestamp = now;
    
    return transformedProducts;
  } catch (error) {
    console.error('Error fetching from Fake Store API:', error.message);
    console.error('Stack trace:', error.stack);
    // Return sample products as fallback instead of throwing error
    const transformedProducts = transformProducts(sampleProducts);
    return transformedProducts;
  }
};

const getFakeStoreProductById = async (id) => {
  try {
    // First check if we have cached products and the ID exists in them
    if (cachedProducts) {
      const cachedProduct = cachedProducts.find(p => p.id == id);
      if (cachedProduct) {
        console.log('Found product in cache:', cachedProduct.id);
        return cachedProduct;
      }
    }
    
    // If not in cache, fetch from API
    console.log('Fetching fresh single product from Fake Store API, ID:', id);
    
    // Convert our transformed ID back to the original Fake Store API ID
    // Our IDs are 1000 + original ID
    const originalId = id - 1000;
    
    // Validate that we have a positive ID
    if (originalId <= 0) {
      return null;
    }
    
    const fakeStoreProduct = await fetchSingleFromFakeStore(originalId);
    
    if (!fakeStoreProduct) {
      return null;
    }
    
    const transformedProduct = transformSingleProduct(fakeStoreProduct);
    
    return transformedProduct;
  } catch (error) {
    console.error('Error fetching single product from Fake Store API:', error.message);
    console.error('Stack trace:', error.stack);
    // Return null as fallback instead of throwing error
    return null;
  }
};

module.exports = {
  getFakeStoreProducts,
  getFakeStoreProductById
};