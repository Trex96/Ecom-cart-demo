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

const fetchSingleFromFakeStore = (id) => {
  // Convert our transformed ID back to the original Fake Store API ID
  // Our IDs start at 1000, but the original IDs start at 1
  const originalId = id - 999;
  
  return new Promise((resolve, reject) => {
    const url = `https://fakestoreapi.com/products/${originalId}`;
    
    console.log('Fetching single product from Fake Store API:', url);
    
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          console.log('Received single product data from Fake Store API, length:', data.length);
          const product = JSON.parse(data);
          console.log('Parsed single product:', product.id);
          resolve(product);
        } catch (error) {
          console.error('Error parsing Fake Store API single product response:', error.message);
          console.error('Raw data:', data.substring(0, 200) + '...');
          reject(error);
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching single product from Fake Store API:', error.message);
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


const transformSingleProduct = (fakeStoreProduct, index) => {
  return {
    id: 1000 + index,
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
    const originalId = id - 999;
    const fakeStoreProduct = await fetchSingleFromFakeStore(originalId);
    
    // Find the index to maintain consistency with our ID transformation
    // In a real implementation, you might want to store a mapping
    const index = originalId - 1;
    const transformedProduct = transformSingleProduct(fakeStoreProduct, index);
    
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