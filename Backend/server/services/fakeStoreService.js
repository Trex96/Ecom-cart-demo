const https = require('https');


let cachedProducts = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; 


const fetchFromFakeStore = () => {
  return new Promise((resolve, reject) => {
    const url = 'https://fakestoreapi.com/products';
    
    console.log('Fetching from Fake Store API:', url);
    
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          console.log('Received data from Fake Store API, length:', data.length);
          const products = JSON.parse(data);
          console.log('Parsed products, count:', products.length);
          resolve(products);
        } catch (error) {
          console.error('Error parsing Fake Store API response:', error.message);
          console.error('Raw data:', data.substring(0, 200) + '...');
          reject(error);
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching from Fake Store API:', error.message);
      reject(error);
    });
  });
};


const transformProducts = (fakeStoreProducts) => {
  console.log('Transforming Fake Store products, input count:', fakeStoreProducts.length);
  const result = fakeStoreProducts.map((product, index) => ({
    id: 1000 + index, 
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
    throw new Error('Failed to fetch products from external API: ' + error.message);
  }
};

module.exports = {
  getFakeStoreProducts
};