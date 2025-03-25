import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './shared/Sidebar';
import './styles/Archive.css';

// Mock archive data - with different types of items
const MOCK_ARCHIVE = [
  // Archived Products
  {
    _id: 'AP001',
    type: 'product',
    item: {
      productId: 'PRD-120',
      name: 'Wireless Earbuds',
      category: 'Electronics',
      lastQuantity: 0,
      price: 89.99,
      supplier: 'Audio Tech Inc.',
      discontinued: true
    },
    archiveDate: '2023-09-15',
    reason: 'Discontinued product',
    archivedBy: 'John Doe'
  },
  {
    _id: 'AP002',
    type: 'product',
    item: {
      productId: 'PRD-098',
      name: 'Desktop Computer',
      category: 'Electronics',
      lastQuantity: 0,
      price: 899.99,
      supplier: 'Tech Solutions Ltd.',
      discontinued: false
    },
    archiveDate: '2023-10-22',
    reason: 'Zero inventory for over 90 days',
    archivedBy: 'Jane Smith'
  },
  {
    _id: 'AP003',
    type: 'product',
    item: {
      productId: 'PRD-056',
      name: 'Executive Desk',
      category: 'Furniture',
      lastQuantity: 0,
      price: 449.99,
      supplier: 'Office Furniture Co.',
      discontinued: false
    },
    archiveDate: '2023-11-05',
    reason: 'Zero inventory for over 90 days',
    archivedBy: 'John Doe'
  },
  
  // Archived Orders
  {
    _id: 'AO001',
    type: 'order',
    item: {
      orderNumber: 'PO-2023-027',
      warehouse: 'Main Warehouse',
      orderDate: '2022-12-05',
      total: 2578.95,
      status: 'cancelled'
    },
    archiveDate: '2023-06-10',
    reason: 'Order cancelled',
    archivedBy: 'Jane Smith'
  },
  {
    _id: 'AO002',
    type: 'order',
    item: {
      orderNumber: 'PO-2022-156',
      warehouse: 'East Coast Storage',
      orderDate: '2022-07-18',
      total: 5490.50,
      status: 'delivered'
    },
    archiveDate: '2023-07-20',
    reason: 'Order completed over 12 months ago',
    archivedBy: 'Mike Johnson'
  },
  
  // Archived Invoices
  {
    _id: 'AI001',
    type: 'invoice',
    item: {
      invoiceNumber: 'INV-2022-089',
      retailer: 'ElectroMart',
      issueDate: '2022-06-15',
      total: 8975.25,
      status: 'paid'
    },
    archiveDate: '2023-06-20',
    reason: 'Invoice paid and over 12 months old',
    archivedBy: 'John Doe'
  },
  {
    _id: 'AI002',
    type: 'invoice',
    item: {
      invoiceNumber: 'INV-2022-103',
      retailer: 'Office Central',
      issueDate: '2022-08-02',
      total: 3295.75,
      status: 'paid'
    },
    archiveDate: '2023-08-05',
    reason: 'Invoice paid and over 12 months old',
    archivedBy: 'Jane Smith'
  },
  
  // Archived Suppliers
  {
    _id: 'AS001',
    type: 'supplier',
    item: {
      supplierName: 'Global Tech Imports',
      contactPerson: 'David Chen',
      email: 'david@globaltechimports.com',
      phone: '123-456-7890',
      relationship: 'inactive'
    },
    archiveDate: '2023-05-12',
    reason: 'No orders placed in 18 months',
    archivedBy: 'Mike Johnson'
  },
  
  // Archived Licenses
  {
    _id: 'AL001',
    type: 'license',
    item: {
      licenseId: 'LIC-2022-001',
      name: 'Microsoft Office 365',
      type: 'Software',
      purchaseDate: '2021-08-15',
      expiryDate: '2022-08-14',
      seats: 50,
      cost: 4999.50,
      vendor: 'Microsoft'
    },
    archiveDate: '2022-10-05',
    reason: 'License expired and not renewed',
    archivedBy: 'John Doe'
  },
  {
    _id: 'AL002',
    type: 'license',
    item: {
      licenseId: 'LIC-2022-002',
      name: 'Adobe Creative Cloud',
      type: 'Software',
      purchaseDate: '2021-05-20',
      expiryDate: '2022-05-19',
      seats: 10,
      cost: 3599.88,
      vendor: 'Adobe'
    },
    archiveDate: '2022-06-30',
    reason: 'Switched to alternative software solution',
    archivedBy: 'Jane Smith'
  },
  {
    _id: 'AL003',
    type: 'license',
    item: {
      licenseId: 'LIC-2022-003',
      name: 'Autodesk AutoCAD',
      type: 'Software',
      purchaseDate: '2021-03-10',
      expiryDate: '2022-03-09',
      seats: 5,
      cost: 7495.00,
      vendor: 'Autodesk'
    },
    archiveDate: '2022-04-15',
    reason: 'Department restructuring, no longer needed',
    archivedBy: 'Mike Johnson'
  },
  {
    _id: 'AL004',
    type: 'license',
    item: {
      licenseId: 'LIC-2022-004',
      name: 'Windows Server 2019',
      type: 'Operating System',
      purchaseDate: '2020-11-25',
      expiryDate: 'Perpetual',
      seats: 2,
      cost: 1799.98,
      vendor: 'Microsoft'
    },
    archiveDate: '2023-01-10',
    reason: 'Server hardware replaced, license no longer needed',
    archivedBy: 'John Doe'
  },
  {
    _id: 'AL005',
    type: 'license',
    item: {
      licenseId: 'LIC-2022-005',
      name: 'Salesforce Enterprise',
      type: 'SaaS',
      purchaseDate: '2022-01-01',
      expiryDate: '2022-12-31',
      seats: 25,
      cost: 18750.00,
      vendor: 'Salesforce'
    },
    archiveDate: '2023-02-15',
    reason: 'Migrated to different CRM solution',
    archivedBy: 'Jane Smith'
  }
];

const Archive = () => {
  const [archivedItems, setArchivedItems] = useState(MOCK_ARCHIVE);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [itemToRestore, setItemToRestore] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'archiveDate', direction: 'descending' });
  const [expandedFilters, setExpandedFilters] = useState(false);

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let results = [...archivedItems];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(item => {
        const searchFields = [];
        
        // Common fields
        searchFields.push(item.reason.toLowerCase());
        searchFields.push(item.archivedBy.toLowerCase());
        
        // Type-specific fields
        if (item.type === 'product') {
          searchFields.push(item.item.productId.toLowerCase());
          searchFields.push(item.item.name.toLowerCase());
          searchFields.push(item.item.category.toLowerCase());
          searchFields.push(item.item.supplier.toLowerCase());
        } else if (item.type === 'order') {
          searchFields.push(item.item.orderNumber.toLowerCase());
          searchFields.push(item.item.warehouse.toLowerCase());
        } else if (item.type === 'invoice') {
          searchFields.push(item.item.invoiceNumber.toLowerCase());
          searchFields.push(item.item.retailer.toLowerCase());
        } else if (item.type === 'supplier') {
          searchFields.push(item.item.supplierName.toLowerCase());
          searchFields.push(item.item.contactPerson.toLowerCase());
          searchFields.push(item.item.email.toLowerCase());
        } else if (item.type === 'license') {
          searchFields.push(item.item.licenseId.toLowerCase());
          searchFields.push(item.item.name.toLowerCase());
          searchFields.push(item.item.type.toLowerCase());
          searchFields.push(item.item.vendor.toLowerCase());
        }
        
        return searchFields.some(field => field.includes(searchTerm.toLowerCase()));
      });
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      results = results.filter(item => item.type === typeFilter);
    }
    
    // Apply date range filter
    if (dateRange.start) {
      results = results.filter(item => new Date(item.archiveDate) >= new Date(dateRange.start));
    }
    
    if (dateRange.end) {
      results = results.filter(item => new Date(item.archiveDate) <= new Date(dateRange.end));
    }
    
    // Apply sorting
    results.sort((a, b) => {
      let aValue, bValue;
      
      if (sortConfig.key === 'archiveDate') {
        aValue = new Date(a.archiveDate);
        bValue = new Date(b.archiveDate);
      } else if (sortConfig.key === 'type') {
        aValue = a.type;
        bValue = b.type;
      } else if (sortConfig.key === 'name') {
        // Name depends on the type of item
        aValue = getItemName(a);
        bValue = getItemName(b);
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredItems(results);
  }, [archivedItems, searchTerm, typeFilter, dateRange, sortConfig]);

  const getItemName = (archiveItem) => {
    switch (archiveItem.type) {
      case 'product':
        return archiveItem.item.name;
      case 'order':
        return archiveItem.item.orderNumber;
      case 'invoice':
        return archiveItem.item.invoiceNumber;
      case 'supplier':
        return archiveItem.item.supplierName;
      case 'license':
        return archiveItem.item.name;
      default:
        return '';
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const handleRestoreItem = (item) => {
    setItemToRestore(item);
    setShowRestoreConfirm(true);
  };

  const confirmRestore = () => {
    // In real app, this would call an API to restore the item
    // For now, we'll just remove it from the archived items
    setArchivedItems(prev => prev.filter(item => item._id !== itemToRestore._id));
    setShowRestoreConfirm(false);
    setItemToRestore(null);
    
    // Show success message (in a real app, you'd use a toast notification)
    alert(`Item ${getItemName(itemToRestore)} has been restored`);
  };

  const handleDeletePermanently = (item) => {
    if (window.confirm(`Are you sure you want to permanently delete ${getItemName(item)}? This action cannot be undone.`)) {
      // In real app, this would call an API to delete the item
      setArchivedItems(prev => prev.filter(archivedItem => archivedItem._id !== item._id));
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const toggleExpandedFilters = () => {
    setExpandedFilters(!expandedFilters);
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="archive-container">
          <div className="archive-header">
            <h1>Archive</h1>
          </div>
          
          <div className="archive-policy-card">
            <button className="archive-help-button" onClick={() => alert('Archive policy would be shown here.')}>
              Archive Policy
            </button>
          </div>
          
          <div className="archive-tools">
            <div className="search-filter">
              <input
                type="text"
                className="search-input"
                placeholder="Search archived items..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              
              <select
                className="type-filter"
                value={typeFilter}
                onChange={handleTypeFilterChange}
              >
                <option value="all">All Types</option>
                <option value="product">Products</option>
                <option value="order">Orders</option>
                <option value="invoice">Invoices</option>
                <option value="supplier">Suppliers</option>
                <option value="license">Licenses</option>
              </select>
              
              <button 
                className={`expand-filters-button ${expandedFilters ? 'expanded' : ''}`}
                onClick={toggleExpandedFilters}
              >
                {expandedFilters ? 'Hide Filters' : 'More Filters'}
              </button>
            </div>
            
            {expandedFilters && (
              <div className="expanded-filters">
                <div className="date-filter">
                  <div className="date-input-group">
                    <label>Archive Date From:</label>
                    <input
                      type="date"
                      name="start"
                      value={dateRange.start}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                  
                  <div className="date-input-group">
                    <label>To:</label>
                    <input
                      type="date"
                      name="end"
                      value={dateRange.end}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                </div>
                
                <div className="sort-options">
                  <label>Sort by:</label>
                  <div className="sort-buttons">
                    <button 
                      className={`sort-button ${sortConfig.key === 'archiveDate' ? 'active' : ''}`}
                      onClick={() => handleSort('archiveDate')}
                    >
                      Date {sortConfig.key === 'archiveDate' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </button>
                    <button 
                      className={`sort-button ${sortConfig.key === 'type' ? 'active' : ''}`}
                      onClick={() => handleSort('type')}
                    >
                      Type {sortConfig.key === 'type' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </button>
                    <button 
                      className={`sort-button ${sortConfig.key === 'name' ? 'active' : ''}`}
                      onClick={() => handleSort('name')}
                    >
                      Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="archive-stats">
            <div className="stat-box">
              <p className="stat-number">{archivedItems.length}</p>
              <p className="stat-label">Total Archived Items</p>
            </div>
            <div className="stat-box">
              <p className="stat-number">
                {archivedItems.filter(item => item.type === 'product').length}
              </p>
              <p className="stat-label">Archived Products</p>
            </div>
            <div className="stat-box">
              <p className="stat-number">
                {archivedItems.filter(item => item.type === 'order').length}
              </p>
              <p className="stat-label">Archived Orders</p>
            </div>
            <div className="stat-box">
              <p className="stat-number">
                {archivedItems.filter(item => item.type === 'license').length}
              </p>
              <p className="stat-label">Archived Licenses</p>
            </div>
          </div>
          
          <div className="archive-table-container">
            {loading ? (
              <div className="loading">Loading archive data...</div>
            ) : filteredItems.length === 0 ? (
              <div className="no-data">No archived items found.</div>
            ) : (
              <table className="archive-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('type')}>
                      Type {sortConfig.key === 'type' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('name')}>
                      Item {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('archiveDate')}>
                      Archive Date {sortConfig.key === 'archiveDate' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th>Reason</th>
                    <th>Archived By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item._id} className={`type-${item.type}`}>
                      <td>
                        <span className={`type-badge ${item.type}`}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="item-name">
                          {getItemName(item)}
                          {item.type === 'product' && (
                            <span className="item-category">{item.item.category}</span>
                          )}
                          {item.type === 'license' && (
                            <span className="item-category">{item.item.type}</span>
                          )}
                        </div>
                      </td>
                      <td>{item.archiveDate}</td>
                      <td className="reason-cell">{item.reason}</td>
                      <td>{item.archivedBy}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="view-details-button"
                            onClick={() => handleViewDetails(item)}
                          >
                            Details
                          </button>
                          <button 
                            className="restore-button"
                            onClick={() => handleRestoreItem(item)}
                          >
                            Restore
                          </button>
                          <button 
                            className="delete-button"
                            onClick={() => handleDeletePermanently(item)}
                          >
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
          
          <div className="export-options-card">
            <h3>Export Archive Data</h3>
            <div className="export-buttons">
              <button className="export-button export-csv" onClick={() => alert('Exporting to CSV...')}>
                Export to CSV
              </button>
              <button className="export-button export-pdf" onClick={() => alert('Exporting to PDF...')}>
                Export to PDF
              </button>
              <button className="export-button export-excel" onClick={() => alert('Exporting to Excel...')}>
                Export to Excel
              </button>
            </div>
          </div>
          
          {showDetailsModal && selectedItem && (
            <div className="details-modal">
              <div className="details-modal-content">
                <div className="details-modal-header">
                  <h2>Archived Item Details</h2>
                  <button 
                    className="close-button"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    ×
                  </button>
                </div>
                
                <div className="details-body">
                  <div className="details-section archive-info">
                    <h3>Archive Information</h3>
                    <div className="info-row">
                      <span>Type:</span>
                      <span className={`type-badge ${selectedItem.type}`}>
                        {selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)}
                      </span>
                    </div>
                    <div className="info-row">
                      <span>Archive Date:</span>
                      <span>{selectedItem.archiveDate}</span>
                    </div>
                    <div className="info-row">
                      <span>Reason:</span>
                      <span>{selectedItem.reason}</span>
                    </div>
                    <div className="info-row">
                      <span>Archived By:</span>
                      <span>{selectedItem.archivedBy}</span>
                    </div>
                  </div>
                  
                  <div className="details-section item-info">
                    <h3>Item Details</h3>
                    
                    {/* Product-specific details */}
                    {selectedItem.type === 'product' && (
                      <>
                        <div className="info-row">
                          <span>Product ID:</span>
                          <span>{selectedItem.item.productId}</span>
                        </div>
                        <div className="info-row">
                          <span>Name:</span>
                          <span>{selectedItem.item.name}</span>
                        </div>
                        <div className="info-row">
                          <span>Category:</span>
                          <span>{selectedItem.item.category}</span>
                        </div>
                        <div className="info-row">
                          <span>Last Quantity:</span>
                          <span>{selectedItem.item.lastQuantity}</span>
                        </div>
                        <div className="info-row">
                          <span>Price:</span>
                          <span>{formatCurrency(selectedItem.item.price)}</span>
                        </div>
                        <div className="info-row">
                          <span>Supplier:</span>
                          <span>{selectedItem.item.supplier}</span>
                        </div>
                        <div className="info-row">
                          <span>Discontinued:</span>
                          <span>{selectedItem.item.discontinued ? 'Yes' : 'No'}</span>
                        </div>
                      </>
                    )}
                    
                    {/* Order-specific details */}
                    {selectedItem.type === 'order' && (
                      <>
                        <div className="info-row">
                          <span>Order Number:</span>
                          <span>{selectedItem.item.orderNumber}</span>
                        </div>
                        <div className="info-row">
                          <span>Warehouse:</span>
                          <span>{selectedItem.item.warehouse}</span>
                        </div>
                        <div className="info-row">
                          <span>Order Date:</span>
                          <span>{selectedItem.item.orderDate}</span>
                        </div>
                        <div className="info-row">
                          <span>Total:</span>
                          <span>{formatCurrency(selectedItem.item.total)}</span>
                        </div>
                        <div className="info-row">
                          <span>Status:</span>
                          <span>{selectedItem.item.status}</span>
                        </div>
                      </>
                    )}
                    
                    {/* Invoice-specific details */}
                    {selectedItem.type === 'invoice' && (
                      <>
                        <div className="info-row">
                          <span>Invoice Number:</span>
                          <span>{selectedItem.item.invoiceNumber}</span>
                        </div>
                        <div className="info-row">
                          <span>Retailer:</span>
                          <span>{selectedItem.item.retailer}</span>
                        </div>
                        <div className="info-row">
                          <span>Issue Date:</span>
                          <span>{selectedItem.item.issueDate}</span>
                        </div>
                        <div className="info-row">
                          <span>Total:</span>
                          <span>{formatCurrency(selectedItem.item.total)}</span>
                        </div>
                        <div className="info-row">
                          <span>Status:</span>
                          <span>{selectedItem.item.status}</span>
                        </div>
                      </>
                    )}
                    
                    {/* Supplier-specific details */}
                    {selectedItem.type === 'supplier' && (
                      <>
                        <div className="info-row">
                          <span>Supplier Name:</span>
                          <span>{selectedItem.item.supplierName}</span>
                        </div>
                        <div className="info-row">
                          <span>Contact Person:</span>
                          <span>{selectedItem.item.contactPerson}</span>
                        </div>
                        <div className="info-row">
                          <span>Email:</span>
                          <span>{selectedItem.item.email}</span>
                        </div>
                        <div className="info-row">
                          <span>Phone:</span>
                          <span>{selectedItem.item.phone}</span>
                        </div>
                        <div className="info-row">
                          <span>Relationship:</span>
                          <span>{selectedItem.item.relationship}</span>
                        </div>
                      </>
                    )}
                    
                    {/* License-specific details */}
                    {selectedItem.type === 'license' && (
                      <>
                        <div className="info-row">
                          <span>License ID:</span>
                          <span>{selectedItem.item.licenseId}</span>
                        </div>
                        <div className="info-row">
                          <span>Name:</span>
                          <span>{selectedItem.item.name}</span>
                        </div>
                        <div className="info-row">
                          <span>Type:</span>
                          <span>{selectedItem.item.type}</span>
                        </div>
                        <div className="info-row">
                          <span>Purchase Date:</span>
                          <span>{selectedItem.item.purchaseDate}</span>
                        </div>
                        <div className="info-row">
                          <span>Expiry Date:</span>
                          <span>{selectedItem.item.expiryDate}</span>
                        </div>
                        <div className="info-row">
                          <span>Seats/Licenses:</span>
                          <span>{selectedItem.item.seats}</span>
                        </div>
                        <div className="info-row">
                          <span>Cost:</span>
                          <span>{formatCurrency(selectedItem.item.cost)}</span>
                        </div>
                        <div className="info-row">
                          <span>Vendor:</span>
                          <span>{selectedItem.item.vendor}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="details-actions">
                  <button 
                    className="restore-button"
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleRestoreItem(selectedItem);
                    }}
                  >
                    Restore Item
                  </button>
                  <button 
                    className="close-details-button"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {showRestoreConfirm && itemToRestore && (
            <div className="confirm-modal">
              <div className="confirm-modal-content">
                <h3>Confirm Restore</h3>
                <p>
                  Are you sure you want to restore{' '}
                  <strong>{getItemName(itemToRestore)}</strong>?
                </p>
                <p className="confirm-details">
                  This will move the item from the archive back to its original location.
                </p>
                
                <div className="confirm-actions">
                  <button 
                    className="confirm-button"
                    onClick={confirmRestore}
                  >
                    Yes, Restore Item
                  </button>
                  <button 
                    className="cancel-button"
                    onClick={() => {
                      setShowRestoreConfirm(false);
                      setItemToRestore(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Archive; 