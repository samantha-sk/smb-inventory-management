import * as mockService from './mongoService';

// Product API calls using local storage instead of backend
export const productAPI = {
  // Get all products
  getProducts: async () => {
    try {
      const data = await mockService.getProducts();
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to fetch products' 
      };
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const data = await mockService.getProductById(id);
      if (!data) {
        return { success: false, error: 'Product not found' };
      }
      return { success: true, data };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return { 
        success: false, 
        error: error.message || 'Failed to fetch product' 
      };
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const result = await mockService.saveProduct(productData);
      if (result.success) {
        return { 
          success: true, 
          data: { 
            ...productData, 
            id: result.productId 
          } 
        };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error creating product:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to create product' 
      };
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const result = await mockService.updateProduct(id, productData);
      if (result.success) {
        // Get the updated product to return
        const updatedProduct = await mockService.getProductById(id);
        return { success: true, data: updatedProduct };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      return { 
        success: false, 
        error: error.message || 'Failed to update product' 
      };
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const result = await mockService.deleteProduct(id);
      if (result.success) {
        return { success: true, data: { message: 'Product deleted successfully' } };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      return { 
        success: false, 
        error: error.message || 'Failed to delete product' 
      };
    }
  },

  // Search products
  searchProducts: async (query, category) => {
    try {
      const data = await mockService.searchProducts(query, category);
      return { success: true, data };
    } catch (error) {
      console.error('Error searching products:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to search products' 
      };
    }
  }
};

export default productAPI; 