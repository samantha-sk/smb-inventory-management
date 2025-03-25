import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './shared/Sidebar';
import './styles/AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    category: '',
    quantity: '',
    price: '',
    supplier: '',
    description: '',
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productId.trim()) {
      newErrors.productId = 'Product ID is required';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be a non-negative number';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would call an API to save the product
      console.log('Product data submitted:', formData);
      
      // Simulate successful save
      alert('Product added successfully!');
      navigate('/inventory');
    }
  };
  
  // Available categories
  const categories = [
    'Electronics', 
    'Furniture', 
    'Office Supplies', 
    'Storage', 
    'Accessories'
  ];
  
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="add-product-container">
          <div className="add-product-header">
            <h1>Add New Product</h1>
            <Link to="/inventory" className="back-button">
              Back to Inventory
            </Link>
          </div>
          
          <form onSubmit={handleSubmit} className="add-product-form">
            <div className="form-grid">
              {/* Product ID */}
              <div className="form-group">
                <label htmlFor="productId">Product ID <span className="required">*</span></label>
                <input
                  type="text"
                  id="productId"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  placeholder="e.g. PRD-016"
                  className={errors.productId ? 'error' : ''}
                />
                {errors.productId && <div className="error-message">{errors.productId}</div>}
              </div>
              
              {/* Product Name */}
              <div className="form-group">
                <label htmlFor="name">Product Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>
              
              {/* Category */}
              <div className="form-group">
                <label htmlFor="category">Category <span className="required">*</span></label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <div className="error-message">{errors.category}</div>}
              </div>
              
              {/* Quantity */}
              <div className="form-group">
                <label htmlFor="quantity">Quantity <span className="required">*</span></label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={errors.quantity ? 'error' : ''}
                />
                {errors.quantity && <div className="error-message">{errors.quantity}</div>}
              </div>
              
              {/* Price */}
              <div className="form-group">
                <label htmlFor="price">Price ($) <span className="required">*</span></label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.price ? 'error' : ''}
                />
                {errors.price && <div className="error-message">{errors.price}</div>}
              </div>
              
              {/* Supplier */}
              <div className="form-group">
                <label htmlFor="supplier">Supplier</label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="Enter supplier name"
                />
              </div>
              
              {/* Description */}
              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter product description"
                ></textarea>
              </div>
              
              {/* Active Status */}
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  Product is active and available for sale
                </label>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => navigate('/inventory')}>
                Cancel
              </button>
              <button type="submit" className="save-button">
                Save Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct; 