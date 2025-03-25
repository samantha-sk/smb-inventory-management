// Mock service for product data - uses local storage instead of MongoDB
// This is a temporary solution until proper backend is implemented

// Mock data for initial state
const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'Laptop Dell XPS 15',
    category: 'Electronics',
    quantity: 25,
    price: 1299.99,
    purchaseDate: '2023-10-15',
    supplier: 'Dell Inc.',
    location: 'Warehouse A',
    reorderLevel: 5,
    sku: 'ELE-LAP-1234',
    createdAt: new Date('2023-10-15').toISOString(),
    updatedAt: new Date('2023-10-15').toISOString()
  },
  {
    id: '2',
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    quantity: 30,
    price: 299.99,
    purchaseDate: '2023-09-20',
    supplier: 'Office Solutions',
    location: 'Warehouse B',
    reorderLevel: 8,
    sku: 'FUR-CHA-5678',
    createdAt: new Date('2023-09-20').toISOString(),
    updatedAt: new Date('2023-09-20').toISOString()
  },
  {
    id: '3',
    name: 'Wireless Mouse',
    category: 'Electronics',
    quantity: 50,
    price: 49.99,
    purchaseDate: '2023-11-05',
    supplier: 'Logitech',
    location: 'Warehouse A',
    reorderLevel: 15,
    sku: 'ELE-MOU-9012',
    createdAt: new Date('2023-11-05').toISOString(),
    updatedAt: new Date('2023-11-05').toISOString()
  }
];

// Initialize local storage with mock data if empty
const initializeStorage = () => {
  const stored = localStorage.getItem('products');
  if (!stored) {
    localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(stored);
};

// Save products to local storage
const saveToStorage = (products) => {
  localStorage.setItem('products', JSON.stringify(products));
};

// Get all products
export const getProducts = async () => {
  try {
    const products = initializeStorage();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const products = initializeStorage();
    return products.find(product => product.id === id) || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// Save a product
export const saveProduct = async (productData) => {
  try {
    const products = initializeStorage();
    
    // Generate ID if not present
    const newProduct = {
      ...productData,
      id: productData.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    saveToStorage(products);
    
    return { success: true, productId: newProduct.id };
  } catch (error) {
    console.error("Error saving product:", error);
    return { success: false, error: error.message };
  }
};

// Update a product
export const updateProduct = async (id, updateData) => {
  try {
    const products = initializeStorage();
    const index = products.findIndex(product => product.id === id);
    
    if (index === -1) {
      return { success: false, error: 'Product not found' };
    }
    
    products[index] = {
      ...products[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    saveToStorage(products);
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    const products = initializeStorage();
    const updatedProducts = products.filter(product => product.id !== id);
    
    if (updatedProducts.length === products.length) {
      return { success: false, error: 'Product not found' };
    }
    
    saveToStorage(updatedProducts);
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
};

// Search products
export const searchProducts = async (query, category) => {
  try {
    const products = initializeStorage();
    
    return products.filter(product => {
      const matchesQuery = !query || 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.sku?.toLowerCase().includes(query.toLowerCase()) ||
        product.supplier?.toLowerCase().includes(query.toLowerCase());
        
      const matchesCategory = !category || category === 'All' || product.category === category;
      
      return matchesQuery && matchesCategory;
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}; 