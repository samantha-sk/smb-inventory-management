import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './shared/Sidebar';
import { productAPI } from '../services/api';
import './styles/Inventory.css';

// Extended mock data with 15 entries
const MOCK_INVENTORY = [
  {
    _id: '1',
    productId: 'PRD-001',
    name: 'Laptop Dell XPS 15',
    category: 'Electronics',
    quantity: 12,
    price: 1499.99,
    supplier: 'Dell Inc.'
  },
  {
    _id: '2',
    productId: 'PRD-002',
    name: 'Office Chair',
    category: 'Furniture',
    quantity: 25,
    price: 199.99,
    supplier: 'Office Furniture Co.'
  },
  {
    _id: '3',
    productId: 'PRD-003',
    name: 'Wireless Mouse',
    category: 'Electronics',
    quantity: 42,
    price: 49.99,
    supplier: 'Logitech'
  },
  {
    _id: '4',
    productId: 'PRD-004',
    name: 'Desk Lamp',
    category: 'Office Supplies',
    quantity: 18,
    price: 39.99,
    supplier: 'LightingX Corp'
  },
  {
    _id: '5',
    productId: 'PRD-005',
    name: 'Filing Cabinet',
    category: 'Storage',
    quantity: 7,
    price: 149.99,
    supplier: 'StoragePlus Inc.'
  },
  {
    _id: '6',
    productId: 'PRD-006',
    name: 'Mechanical Keyboard',
    category: 'Electronics',
    quantity: 30,
    price: 129.99,
    supplier: 'Razer'
  },
  {
    _id: '7',
    productId: 'PRD-007',
    name: 'Monitor 27"',
    category: 'Electronics',
    quantity: 15,
    price: 299.99,
    supplier: 'LG Electronics'
  },
  {
    _id: '8',
    productId: 'PRD-008',
    name: 'Whiteboard',
    category: 'Office Supplies',
    quantity: 10,
    price: 89.99,
    supplier: 'Office Depot'
  },
  {
    _id: '9',
    productId: 'PRD-009',
    name: 'Ergonomic Desk',
    category: 'Furniture',
    quantity: 8,
    price: 599.99,
    supplier: 'ErgoWorks'
  },
  {
    _id: '10',
    productId: 'PRD-010',
    name: 'Paper Shredder',
    category: 'Office Supplies',
    quantity: 12,
    price: 79.99,
    supplier: 'Office Depot'
  },
  {
    _id: '11',
    productId: 'PRD-011',
    name: 'External SSD 1TB',
    category: 'Electronics',
    quantity: 20,
    price: 159.99,
    supplier: 'Samsung'
  },
  {
    _id: '12',
    productId: 'PRD-012',
    name: 'Bookshelf',
    category: 'Storage',
    quantity: 5,
    price: 179.99,
    supplier: 'IKEA'
  },
  {
    _id: '13',
    productId: 'PRD-013',
    name: 'Wireless Headphones',
    category: 'Electronics',
    quantity: 18,
    price: 249.99,
    supplier: 'Sony'
  },
  {
    _id: '14',
    productId: 'PRD-014',
    name: 'Office Phone',
    category: 'Electronics',
    quantity: 9,
    price: 129.99,
    supplier: 'Cisco'
  },
  {
    _id: '15',
    productId: 'PRD-015',
    name: 'Conference Table',
    category: 'Furniture',
    quantity: 3,
    price: 899.99,
    supplier: 'Office Furniture Co.'
  }
];

const Inventory = () => {
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [categories, setCategories] = useState([]);
  
  // Price range filter state
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);

  useEffect(() => {
    // Extract unique categories from inventory
    const uniqueCategories = [...new Set(MOCK_INVENTORY.map(item => item.category))];
    setCategories(uniqueCategories);
    
    // Find min and max price for range slider
    const prices = MOCK_INVENTORY.map(item => item.price);
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));
    setMinPrice(min);
    setMaxPrice(max);
    setPriceRange([min, max]);
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setInventory(inventory.filter(item => item._id !== id));
    }
  };

  // Handle price range change
  const handlePriceRangeChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = Number(e.target.value);
    
    // Make sure min <= max
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[0] = newRange[1];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[1] = newRange[0];
    }
    
    setPriceRange(newRange);
    
    // Update CSS variables for the active range visual indicator
    const sliderContainer = document.querySelector('.price-slider-container');
    if (sliderContainer) {
      const leftPercent = ((newRange[0] - minPrice) / (maxPrice - minPrice)) * 100;
      const rightPercent = ((newRange[1] - minPrice) / (maxPrice - minPrice)) * 100;
      sliderContainer.style.setProperty('--left-percent', `${leftPercent}%`);
      sliderContainer.style.setProperty('--right-percent', `${rightPercent}%`);
    }
  };

  // Apply sorting
  const sortedInventory = [...inventory].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Apply filtering
  const filteredInventory = sortedInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.productId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Export to CSV function
  const exportData = (format) => {
    switch (format) {
      case 'csv':
        const csvData = filteredInventory.map(item => ({
          'Product ID': item.productId,
          'Product Name': item.name,
          'Category': item.category,
          'Quantity': item.quantity,
          'Price': `$${item.price.toFixed(2)}`,
          'Supplier': item.supplier
        }));
        
        alert('CSV export initiated. File would be downloaded in a real application.');
        console.log('Exporting CSV data:', csvData);
        break;
      case 'excel':
        alert('Excel export initiated. File would be downloaded in a real application.');
        break;
      case 'pdf':
        alert('PDF export initiated. File would be downloaded in a real application.');
        break;
      default:
        break;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="inventory-container">
          <div className="inventory-header">
            <h1>Inventory Management</h1>
            <Link to="/add-product" className="add-button">
              <span>Add New Product</span>
            </Link>
          </div>
          
          <div className="inventory-tools">
            <div className="search-filter">
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Archive Policy Section */}
            <div className="archive-policy">
              <strong>Archiving Policy:</strong> Items with zero inventory for over 90 days will be automatically archived. 
              Archived items can be restored at any time from the Archive section.
            </div>
            
            {/* Price Range Slider */}
            <div className="price-range-filter">
              <label>Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
              <div 
                className="price-slider-container" 
                style={{
                  '--left-percent': `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                  '--right-percent': `${((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`
                }}
              >
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(e, 0)}
                  className="price-slider min-price"
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(e, 1)}
                  className="price-slider max-price"
                />
              </div>
            </div>
            
            <div className="export-options">
              <button className="export-button" onClick={() => exportData('csv')}>
                Export CSV
              </button>
              <button className="export-button" onClick={() => exportData('excel')}>
                Export Excel
              </button>
              <button className="export-button" onClick={() => exportData('pdf')}>
                Export PDF
              </button>
            </div>
          </div>
          
          <div className="inventory-stats">
            <div className="stat-box">
              <p className="stat-number">{filteredInventory.length}</p>
              <p className="stat-label">Total Products</p>
            </div>
            <div className="stat-box">
              <p className="stat-number">
                {filteredInventory.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
              <p className="stat-label">Total Items</p>
            </div>
            <div className="stat-box">
              <p className="stat-number">
                ${filteredInventory.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
              </p>
              <p className="stat-label">Inventory Value</p>
            </div>
            <div className="stat-box">
              <p className="stat-number">
                {filteredInventory.filter(item => item.quantity < 10).length}
              </p>
              <p className="stat-label">Low Stock Items</p>
            </div>
          </div>
          
          <div className="inventory-table-container">
            {loading ? (
              <div className="loading">Loading inventory data...</div>
            ) : filteredInventory.length === 0 ? (
              <div className="no-data">No products found.</div>
            ) : (
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('productId')}>
                      Product ID {sortConfig.key === 'productId' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('name')}>
                      Product Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('category')}>
                      Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('quantity')}>
                      Quantity {sortConfig.key === 'quantity' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('price')}>
                      Price {sortConfig.key === 'price' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('supplier')}>
                      Supplier {sortConfig.key === 'supplier' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item._id} className={item.quantity < 10 ? 'low-stock' : ''}>
                      <td>{item.productId}</td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.supplier}</td>
                      <td>
                        <div className="action-buttons">
                          <Link to={`/edit-product/${item._id}`} className="edit-button">
                            Edit
                          </Link>
                          <button className="delete-button" onClick={() => handleDelete(item._id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory; 