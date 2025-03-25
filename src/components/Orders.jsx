import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './shared/Sidebar';
import './styles/Orders.css';

// Mock orders data
const MOCK_ORDERS = [
  {
    id: 'PO-2023-001',
    supplier: 'Tech Components Inc.',
    orderDate: '2023-11-15',
    total: 12450.75,
    status: 'delivered',
    expectedDelivery: '2023-11-22',
    actualDelivery: '2023-11-21',
    items: [
      { id: 1, name: 'Dell XPS Laptop', quantity: 5, price: 1299.99, unitOfMeasure: 'unit', specifications: { processor: 'Intel i7', ram: '16GB', storage: '512GB SSD', dimensions: '13.3"', warranty: '3 years' } },
      { id: 2, name: 'Wireless Mouse', quantity: 10, price: 49.99, unitOfMeasure: 'unit', specifications: { connectivity: 'Bluetooth', battery: 'AA x2', dimensions: '4.5" x 2.3" x 1.5"', warranty: '1 year' } },
      { id: 3, name: 'USB-C Docking Station', quantity: 5, price: 189.99, unitOfMeasure: 'unit', specifications: { ports: '6 USB, 2 HDMI, 1 Ethernet', power: '100W', dimensions: '6.7" x 3.1" x 1.1"', warranty: '2 years' } }
    ],
    shipment: [
      { date: '2023-11-16', status: 'Processing', details: 'Order received and processing begun' },
      { date: '2023-11-17', status: 'Packed', details: 'Items packed and awaiting pickup' },
      { date: '2023-11-18', status: 'Shipped', details: 'Package picked up by courier - Tracking #TR5689214' },
      { date: '2023-11-21', status: 'Delivered', details: 'Package delivered and signed by J. Smith' }
    ],
    warehouse: 'Central Distribution',
    notes: 'First order from this supplier, excellent packaging and on-time delivery.'
  },
  {
    id: 'PO-2023-002',
    supplier: 'Office Furniture Co.',
    orderDate: '2023-11-20',
    total: 5780.50,
    status: 'in-transit',
    expectedDelivery: '2023-12-05',
    actualDelivery: null,
    items: [
      { id: 1, name: 'Executive Chair', quantity: 3, price: 599.99, unitOfMeasure: 'unit', specifications: { material: 'Leather', color: 'Black', adjustable: 'Yes', dimensions: '28"W x 30"D x 45"H', warranty: '5 years' } },
      { id: 2, name: 'Conference Table', quantity: 1, price: 2499.99, unitOfMeasure: 'unit', specifications: { material: 'Oak', color: 'Dark Brown', seating: '10 persons', dimensions: '96"L x 48"W x 30"H', warranty: '7 years' } },
      { id: 3, name: 'Filing Cabinet', quantity: 5, price: 299.99, unitOfMeasure: 'unit', specifications: { material: 'Steel', drawers: '4', locking: 'Yes', dimensions: '18"W x 25"D x 52"H', warranty: '10 years' } }
    ],
    shipment: [
      { date: '2023-11-21', status: 'Processing', details: 'Order received and processing begun' },
      { date: '2023-11-25', status: 'Packed', details: 'Items packed and awaiting pickup' },
      { date: '2023-11-30', status: 'Shipped', details: 'Package picked up by freight service - Tracking #FR3385721' }
    ],
    warehouse: 'South Storage Facility',
    notes: 'Bulk furniture order, requested padded packaging for sensitive items.'
  },
  {
    id: 'PO-2023-003',
    supplier: 'Office Supplies Direct',
    orderDate: '2023-11-25',
    total: 1825.35,
    status: 'processing',
    expectedDelivery: '2023-12-10',
    actualDelivery: null,
    items: [
      { id: 1, name: 'Printer Paper', quantity: 50, price: 9.99, unitOfMeasure: 'ream', specifications: { weight: '20lb', sheets: '500', brightness: '96', size: '8.5" x 11"' } },
      { id: 2, name: 'Ballpoint Pens', quantity: 100, price: 2.99, unitOfMeasure: 'box', specifications: { color: 'Blue', quantity: '12/box', type: 'Retractable', point: 'Medium' } },
      { id: 3, name: 'Toner Cartridges', quantity: 10, price: 89.99, unitOfMeasure: 'unit', specifications: { compatibility: 'HP LaserJet Pro', yield: '2,500 pages', color: 'Black', warranty: '90 days' } }
    ],
    shipment: [
      { date: '2023-11-26', status: 'Processing', details: 'Order received and processing begun' }
    ],
    warehouse: 'East Coast Distribution',
    notes: 'Standing order for monthly office supplies.'
  },
  {
    id: 'PO-2023-004',
    supplier: 'Electronics Wholesale',
    orderDate: '2023-11-05',
    total: 8975.25,
    status: 'pending-approval',
    expectedDelivery: null,
    actualDelivery: null,
    items: [
      { id: 1, name: 'Smart TV 55"', quantity: 5, price: 799.99, unitOfMeasure: 'unit', specifications: { resolution: '4K UHD', connections: 'HDMI x3, USB x2', smart: 'Android TV', dimensions: '48.8"W x 28.1"H x 3.1"D', warranty: '2 years' } },
      { id: 2, name: 'Sound Bar', quantity: 5, price: 349.99, unitOfMeasure: 'unit', specifications: { channels: '5.1', connectivity: 'Bluetooth, HDMI, Optical', power: '500W', dimensions: '40"W x 3"H x 4"D', warranty: '1 year' } },
      { id: 3, name: 'Wireless Headphones', quantity: 10, price: 229.99, unitOfMeasure: 'unit', specifications: { type: 'Over-ear', noise_canceling: 'Yes', battery: '30 hours', connectivity: 'Bluetooth 5.0', warranty: '1 year' } }
    ],
    shipment: [],
    warehouse: 'West Region Warehouse',
    notes: 'Awaiting manager approval for budget allocation.'
  },
  {
    id: 'PO-2023-005',
    supplier: 'Industrial Equipment Co.',
    orderDate: '2023-10-10',
    total: 15785.50,
    status: 'cancelled',
    expectedDelivery: '2023-10-30',
    actualDelivery: null,
    items: [
      { id: 1, name: 'Forklift', quantity: 1, price: 12500.00, unitOfMeasure: 'unit', specifications: { capacity: '5000 lbs', lift: '188"', power: 'Electric', dimensions: '8\'L x 4\'W x 7\'H', warranty: '2 years' } },
      { id: 2, name: 'Pallet Jack', quantity: 3, price: 699.50, unitOfMeasure: 'unit', specifications: { capacity: '5500 lbs', fork: '48"', wheels: 'Polyurethane', dimensions: '63"L x 27"W x 47"H', warranty: '1 year' } },
      { id: 3, name: 'Safety Vests', quantity: 20, price: 24.99, unitOfMeasure: 'unit', specifications: { standard: 'ANSI Class 2', color: 'High-vis Yellow', reflective: 'Yes', size: 'One Size Fits Most' } }
    ],
    shipment: [
      { date: '2023-10-12', status: 'Processing', details: 'Order received and processing begun' },
      { date: '2023-10-20', status: 'Cancelled', details: 'Order cancelled due to supplier inventory shortages' }
    ],
    warehouse: 'North Distribution Center',
    notes: 'Order cancelled due to extended lead time on forklift. Will reorder when back in stock.'
  }
];

const Orders = () => {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [sortConfig, setSortConfig] = useState({ key: 'orderDate', direction: 'descending' });

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setActiveTab('details');
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const handlePrintOrder = () => {
    alert(`Printing order ${selectedOrder.id}...`);
    // In a real application, this would trigger the print functionality
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'status-delivered';
      case 'in-transit':
        return 'status-in-transit';
      case 'processing':
        return 'status-processing';
      case 'pending-approval':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'in-transit':
        return 'In Transit';
      case 'processing':
        return 'Processing';
      case 'pending-approval':
        return 'Pending Approval';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    // Apply search filter
    const searchFields = [
      order.id,
      order.supplier,
      order.warehouse
    ];
    const matchesSearch = searchTerm === '' || 
      searchFields.some(field => field.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    // Apply date range filter
    let matchesDateRange = true;
    if (dateRange.start) {
      matchesDateRange = matchesDateRange && new Date(order.orderDate) >= new Date(dateRange.start);
    }
    if (dateRange.end) {
      matchesDateRange = matchesDateRange && new Date(order.orderDate) <= new Date(dateRange.end);
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  }).sort((a, b) => {
    if (sortConfig.key === 'orderDate' || sortConfig.key === 'expectedDelivery') {
      // Sort by date
      const dateA = new Date(a[sortConfig.key] || '9999-12-31'); // Use far future date for null values
      const dateB = new Date(b[sortConfig.key] || '9999-12-31');
      
      return sortConfig.direction === 'ascending' 
        ? dateA - dateB 
        : dateB - dateA;
    } else {
      // Sort by string or number
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }
  });

  // Order statistics for display
  const orderStats = {
    total: orders.length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    inTransit: orders.filter(order => order.status === 'in-transit').length,
    processing: orders.filter(order => order.status === 'processing').length,
    pending: orders.filter(order => order.status === 'pending-approval').length
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="orders-container">
          {selectedOrder ? (
            <div className="order-details-container">
              <div className="order-details-header">
                <h2>Order Details: {selectedOrder.id}</h2>
                <div className="order-header-actions">
                  <button 
                    className="print-button"
                    onClick={handlePrintOrder}
                  >
                    Print Order
                  </button>
                  <button 
                    className="close-button"
                    onClick={closeOrderDetails}
                  >
                    &times;
                  </button>
                </div>
              </div>
              
              <div className="order-tabs">
                <button 
                  className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  Order Details
                </button>
                <button 
                  className={`tab-button ${activeTab === 'tracking' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tracking')}
                >
                  Tracking & Status
                </button>
                <button 
                  className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                  onClick={() => setActiveTab('products')}
                >
                  Product Details
                </button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'details' && (
                  <div className="order-details-tab">
                    <div className="order-summary">
                      <div className="order-summary-row">
                        <div className="summary-item">
                          <span className="label">Order Number:</span>
                          <span className="value">{selectedOrder.id}</span>
                        </div>
                        <div className="summary-item">
                          <span className="label">Order Date:</span>
                          <span className="value">{formatDate(selectedOrder.orderDate)}</span>
                        </div>
                      </div>
                      
                      <div className="order-summary-row">
                        <div className="summary-item">
                          <span className="label">Supplier:</span>
                          <span className="value">{selectedOrder.supplier}</span>
                        </div>
                        <div className="summary-item">
                          <span className="label">Warehouse:</span>
                          <span className="value">{selectedOrder.warehouse}</span>
                        </div>
                      </div>
                      
                      <div className="order-summary-row">
                        <div className="summary-item">
                          <span className="label">Status:</span>
                          <span className={`value status ${getStatusClass(selectedOrder.status)}`}>
                            {getStatusDisplay(selectedOrder.status)}
                          </span>
                        </div>
                        <div className="summary-item">
                          <span className="label">Total:</span>
                          <span className="value">{formatCurrency(selectedOrder.total)}</span>
                        </div>
                      </div>
                      
                      <div className="order-summary-row">
                        <div className="summary-item">
                          <span className="label">Expected Delivery:</span>
                          <span className="value">{formatDate(selectedOrder.expectedDelivery)}</span>
                        </div>
                        <div className="summary-item">
                          <span className="label">Actual Delivery:</span>
                          <span className="value">{formatDate(selectedOrder.actualDelivery)}</span>
                        </div>
                      </div>
                      
                      {selectedOrder.notes && (
                        <div className="order-notes">
                          <h4>Notes:</h4>
                          <p>{selectedOrder.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="order-items">
                      <h3>Ordered Items</h3>
                      <table className="items-table">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map(item => (
                            <tr key={item.id}>
                              <td>{item.name}</td>
                              <td>{item.quantity}</td>
                              <td>{item.unitOfMeasure}</td>
                              <td>{formatCurrency(item.price)}</td>
                              <td>{formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="4" className="total-label">Total:</td>
                            <td className="total-value">{formatCurrency(selectedOrder.total)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
                
                {activeTab === 'tracking' && (
                  <div className="tracking-tab">
                    <div className="shipment-timeline">
                      <h3>Shipment Status</h3>
                      {selectedOrder.shipment.length === 0 ? (
                        <p className="no-tracking">No tracking information available yet.</p>
                      ) : (
                        <div className="timeline">
                          {selectedOrder.shipment.map((event, index) => (
                            <div className="timeline-item" key={index}>
                              <div className="timeline-point"></div>
                              <div className="timeline-content">
                                <div className="timeline-date">{formatDate(event.date)}</div>
                                <div className="timeline-status">{event.status}</div>
                                <div className="timeline-details">{event.details}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="delivery-info">
                      <h3>Delivery Information</h3>
                      <div className="delivery-details">
                        <div className="delivery-row">
                          <span className="label">Expected Delivery Date:</span>
                          <span className="value">{formatDate(selectedOrder.expectedDelivery)}</span>
                        </div>
                        <div className="delivery-row">
                          <span className="label">Actual Delivery Date:</span>
                          <span className="value">{formatDate(selectedOrder.actualDelivery)}</span>
                        </div>
                        <div className="delivery-row">
                          <span className="label">Delivery Status:</span>
                          <span className={`value status ${getStatusClass(selectedOrder.status)}`}>
                            {getStatusDisplay(selectedOrder.status)}
                          </span>
                        </div>
                        <div className="delivery-row">
                          <span className="label">Destination:</span>
                          <span className="value">{selectedOrder.warehouse}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'products' && (
                  <div className="products-tab">
                    <h3>Product Specifications</h3>
                    
                    {selectedOrder.items.map(item => (
                      <div className="product-specs" key={item.id}>
                        <div className="product-specs-header">
                          <h4>{item.name}</h4>
                          <div className="product-quantity">
                            Quantity: <strong>{item.quantity}</strong> {item.unitOfMeasure}
                          </div>
                        </div>
                        
                        <div className="specs-table">
                          <table>
                            <tbody>
                              {Object.entries(item.specifications).map(([key, value]) => (
                                <tr key={key}>
                                  <td className="spec-name">{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                                  <td className="spec-value">{value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="orders-header">
                <h1>Purchase Orders</h1>
                <Link to="/new-order" className="new-order-button">
                  Create New Order
                </Link>
              </div>
              
              <div className="order-tools">
                <div className="search-filter">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  
                  <select
                    className="status-filter"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                  >
                    <option value="all">All Statuses</option>
                    <option value="delivered">Delivered</option>
                    <option value="in-transit">In Transit</option>
                    <option value="processing">Processing</option>
                    <option value="pending-approval">Pending Approval</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="date-filter">
                  <div className="date-input-group">
                    <label>Order Date From:</label>
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
              </div>
              
              <div className="orders-stats">
                <div className="stat-box">
                  <p className="stat-number">{orderStats.total}</p>
                  <p className="stat-label">Total Orders</p>
                </div>
                <div className="stat-box">
                  <p className="stat-number">{orderStats.delivered}</p>
                  <p className="stat-label">Delivered</p>
                </div>
                <div className="stat-box">
                  <p className="stat-number">{orderStats.inTransit}</p>
                  <p className="stat-label">In Transit</p>
                </div>
                <div className="stat-box">
                  <p className="stat-number">{orderStats.processing + orderStats.pending}</p>
                  <p className="stat-label">Processing</p>
                </div>
              </div>
              
              <div className="orders-table-container">
                {loading ? (
                  <div className="loading">Loading order data...</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="no-data">No orders found.</div>
                ) : (
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('id')}>
                          Order # {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('supplier')}>
                          Supplier {sortConfig.key === 'supplier' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('orderDate')}>
                          Order Date {sortConfig.key === 'orderDate' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('expectedDelivery')}>
                          Expected Delivery {sortConfig.key === 'expectedDelivery' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('total')}>
                          Total {sortConfig.key === 'total' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('status')}>
                          Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(order => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.supplier}</td>
                          <td>{formatDate(order.orderDate)}</td>
                          <td>{formatDate(order.expectedDelivery)}</td>
                          <td>{formatCurrency(order.total)}</td>
                          <td>
                            <span className={`status-badge ${getStatusClass(order.status)}`}>
                              {getStatusDisplay(order.status)}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="view-details-button"
                                onClick={() => viewOrderDetails(order)}
                              >
                                View Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
