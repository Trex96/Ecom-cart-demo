const https = require('https');


let cachedProducts = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; 


const fetchFromFakeStore = () => {
  return new Promise((resolve, reject) => {
    const url = 'https://fakestoreapi.com/products';
    
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const products = JSON.parse(data);
          resolve(products);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};


const transformProducts = (fakeStoreProducts) => {
  return fakeStoreProducts.map((product, index) => ({
    id: 1000 + index, 
    name: product.title,
    price: product.price,
    description: product.description,
    image: product.image,
    category: product.category,
    stock: Math.floor(Math.random() * 100) + 1 
  }));
};


const getFakeStoreProducts = async () => {
  const now = Date.now();
  

  if (cachedProducts && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedProducts;
  }
  
  try {

    const fakeStoreProducts = await fetchFromFakeStore();
    const transformedProducts = transformProducts(fakeStoreProducts);
    

    cachedProducts = transformedProducts;
    cacheTimestamp = now;
    
    return transformedProducts;
  } catch (error) {
    console.error('Error fetching from Fake Store API:', error.message);
    throw new Error('Failed to fetch products from external API');
  }
};

module.exports = {
  getFakeStoreProducts
};