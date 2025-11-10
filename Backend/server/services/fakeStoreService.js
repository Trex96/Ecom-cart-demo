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
          // Check if the response is HTML instead of JSON
          if (data.trim().startsWith('<')) {
            console.error('Received HTML instead of JSON from Fake Store API');
            reject(new Error('Received HTML instead of JSON from Fake Store API'));
            return;
          }
          
          // Check for empty response
          if (!data || data.length === 0) {
            console.error('Received empty response from Fake Store API');
            reject(new Error('Received empty response from Fake Store API'));
            return;
          }
          
          const products = JSON.parse(data);
          console.log('Parsed products, count:', products.length);
          resolve(products);
        } catch (error) {
          console.error('Error parsing Fake Store API response:', error.message);
          console.error('Raw data:', data.substring(0, 200) + '...');
          reject(new Error('Failed to parse response from Fake Store API: ' + error.message));
        }
      });
    }).on('error', (error) => {
      console.error('Network error fetching from Fake Store API:', error.message);
      reject(new Error('Network error fetching from Fake Store API: ' + error.message));
    });
  });
};

const fetchSingleFromFakeStore = (id) => {
  return new Promise((resolve, reject) => {
    // Validate ID is positive
    if (id <= 0) {
      reject(new Error('Invalid product ID: ' + id));
      return;
    }
    
    const url = `https://fakestoreapi.com/products/${id}`;
    
    console.log('Fetching single product from Fake Store API:', url);
    
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          console.log('Received single product data from Fake Store API, length:', data.length);
          // Check if the response is HTML instead of JSON
          if (data.trim().startsWith('<')) {
            console.error('Received HTML instead of JSON from Fake Store API for product:', id);
            reject(new Error('Received HTML instead of JSON from Fake Store API'));
            return;
          }
          
          // Check for empty response or 404
          if (!data || data.length === 0 || data.includes('404') || data.includes('Not Found')) {
            console.error('Received empty or 404 response from Fake Store API for product:', id);
            reject(new Error('Product not found in Fake Store API'));
            return;
          }
          
          const product = JSON.parse(data);
          console.log('Parsed single product:', product.id);
          resolve(product);
        } catch (error) {
          console.error('Error parsing Fake Store API single product response:', error.message);
          console.error('Raw data:', data.substring(0, 200) + '...');
          reject(new Error('Failed to parse response from Fake Store API: ' + error.message));
        }
      });
    }).on('error', (error) => {
      console.error('Network error fetching single product from Fake Store API:', error.message);
      reject(new Error('Network error fetching single product from Fake Store API: ' + error.message));
    });
  });
};


const transformProducts = (fakeStoreProducts) => {
  console.log('Transforming Fake Store products, input count:', fakeStoreProducts.length);
  const result = fakeStoreProducts.map((product, index) => ({
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
    throw new Error('Failed to fetch products from external API: ' + error.message);
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
      throw new Error('Invalid product ID: ' + id);
    }
    
    const fakeStoreProduct = await fetchSingleFromFakeStore(originalId);
    
    const transformedProduct = transformSingleProduct(fakeStoreProduct);
    
    return transformedProduct;
  } catch (error) {
    console.error('Error fetching single product from Fake Store API:', error.message);
    console.error('Stack trace:', error.stack);
    throw new Error('Failed to fetch product from external API: ' + error.message);
  }
};

module.exports = {
  getFakeStoreProducts,
  getFakeStoreProductById
};