import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './shared/Sidebar';
import './styles/Billing.css';

// Mock billing data
const MOCK_BILLS = [
  {
    _id: 'B001',
    billNumber: 'INV-2023-001',
    retailer: {
      id: 'R001',
      name: 'SuperMart',
      address: '123 Main St, New York, NY',
      phone: '212-555-1234',
      email: 'accounts@supermart.com'
    },
    items: [
      { productId: 'PRD-001', name: 'Laptop Dell XPS 15', quantity: 5, unitPrice: 1499.99, total: 7499.95 },
      { productId: 'PRD-006', name: 'Mechanical Keyboard', quantity: 10, unitPrice: 129.99, total: 1299.90 }
    ],
    issueDate: '2023-10-15',
    dueDate: '2023-11-15',
    subtotal: 8799.85,
    tax: 703.99,
    discount: 500.00,
    total: 9003.84,
    status: 'paid',
    paymentDate: '2023-11-10',
    notes: 'Paid via bank transfer'
  },
  {
    _id: 'B002',
    billNumber: 'INV-2023-002',
    retailer: {
      id: 'R002',
      name: 'Tech Corner',
      address: '456 Oak Ave, Chicago, IL',
      phone: '312-555-7890',
      email: 'billing@techcorner.com'
    },
    items: [
      { productId: 'PRD-007', name: 'Monitor 27"', quantity: 8, unitPrice: 299.99, total: 2399.92 },
      { productId: 'PRD-003', name: 'Wireless Mouse', quantity: 15, unitPrice: 49.99, total: 749.85 },
      { productId: 'PRD-013', name: 'Wireless Headphones', quantity: 5, unitPrice: 249.99, total: 1249.95 }
    ],
    issueDate: '2023-11-05',
    dueDate: '2023-12-05',
    subtotal: 4399.72,
    tax: 351.98,
    discount: 200.00,
    total: 4551.70,
    status: 'pending',
    paymentDate: null,
    notes: 'Net 30 terms'
  },
  {
    _id: 'B003',
    billNumber: 'INV-2023-003',
    retailer: {
      id: 'R003',
      name: 'Office Central',
      address: '789 Business Blvd, Austin, TX',
      phone: '512-555-4321',
      email: 'finance@officecentral.com'
    },
    items: [
      { productId: 'PRD-002', name: 'Office Chair', quantity: 12, unitPrice: 199.99, total: 2399.88 },
      { productId: 'PRD-005', name: 'Filing Cabinet', quantity: 4, unitPrice: 149.99, total: 599.96 },
      { productId: 'PRD-009', name: 'Ergonomic Desk', quantity: 3, unitPrice: 599.99, total: 1799.97 }
    ],
    issueDate: '2023-11-20',
    dueDate: '2023-12-20',
    subtotal: 4799.81,
    tax: 383.98,
    discount: 300.00,
    total: 4883.79,
    status: 'overdue',
    paymentDate: null,
    notes: 'Second reminder sent on 2023-12-25'
  },
  {
    _id: 'B004',
    billNumber: 'INV-2023-004',
    retailer: {
      id: 'R004',
      name: 'TechWorld',
      address: '101 Silicon Ave, San Francisco, CA',
      phone: '415-555-9876',
      email: 'accounts@techworld.com'
    },
    items: [
      { productId: 'PRD-011', name: 'External SSD 1TB', quantity: 10, unitPrice: 159.99, total: 1599.90 },
      { productId: 'PRD-014', name: 'Office Phone', quantity: 6, unitPrice: 129.99, total: 779.94 }
    ],
    issueDate: '2023-12-01',
    dueDate: '2024-01-01',
    subtotal: 2379.84,
    tax: 190.39,
    discount: 100.00,
    total: 2470.23,
    status: 'paid',
    paymentDate: '2023-12-28',
    notes: 'Paid via credit card'
  },
  {
    _id: 'B005',
    billNumber: 'INV-2023-005',
    retailer: {
      id: 'R005',
      name: 'Furniture Plus',
      address: '222 Comfort St, Miami, FL',
      phone: '305-555-6543',
      email: 'payments@furnitureplus.com'
    },
    items: [
      { productId: 'PRD-015', name: 'Conference Table', quantity: 2, unitPrice: 899.99, total: 1799.98 },
      { productId: 'PRD-002', name: 'Office Chair', quantity: 8, unitPrice: 199.99, total: 1599.92 }
    ],
    issueDate: '2023-12-15',
    dueDate: '2024-01-15',
    subtotal: 3399.90,
    tax: 272.00,
    discount: 150.00,
    total: 3521.90,
    status: 'pending',
    paymentDate: null,
    notes: 'Net 30 terms'
  }
];

const Billing = () => {
  const [bills, setBills] = useState(MOCK_BILLS);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    // Apply filters
    let results = [...bills];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(bill => 
        bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.retailer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(bill => bill.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateRange.start) {
      results = results.filter(bill => new Date(bill.issueDate) >= new Date(dateRange.start));
    }
    
    if (dateRange.end) {
      results = results.filter(bill => new Date(bill.issueDate) <= new Date(dateRange.end));
    }
    
    setFilteredBills(results);
  }, [bills, searchTerm, statusFilter, dateRange]);

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

  const handleViewInvoice = (bill) => {
    setSelectedBill(bill);
    setShowInvoiceModal(true);
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updatedBills = bills.map(bill => {
      if (bill._id === id) {
        return {
          ...bill,
          status: newStatus,
          paymentDate: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : bill.paymentDate
        };
      }
      return bill;
    });
    
    setBills(updatedBills);
  };

  const handlePrintInvoice = (bill) => {
    // In a real app, this would open a print-friendly version of the invoice
    console.log('Printing invoice:', bill.billNumber);
    alert(`Printing invoice ${bill.billNumber}`);
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="billing-container">
          <div className="billing-header">
            <h1>Billing Management</h1>
            <Link to="/create-bill" className="new-bill-button">
              <span>Create New Bill</span>
            </Link>
          </div>
          
          <div className="billing-tools">
            <div className="search-filter">
              <input
                type="text"
                className="search-input"
                placeholder="Search bills by number or retailer..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              
              <select
                className="status-filter"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            
            <div className="date-filter">
              <div className="date-input-group">
                <label>From:</label>
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
          
          <div className="billing-stats">
            <div className="stat-box">
              <p className="stat-number">{bills.length}</p>
              <p className="stat-label">Total Bills</p>
            </div>
            <div className="stat-box">
              <p className="stat-number">
                {formatCurrency(bills.reduce((sum, bill) => sum + bill.total, 0))}
              </p>
              <p className="stat-label">Total Billed</p>
            </div>
            <div className="stat-box">
              <p className="stat-number">
                {formatCurrency(bills.filter(bill => bill.status === 'paid').reduce((sum, bill) => sum + bill.total, 0))}
              </p>
              <p className="stat-label">Total Paid</p>
            </div>
            <div className="stat-box">
              <p className="stat-number">
                {formatCurrency(bills.filter(bill => bill.status !== 'paid').reduce((sum, bill) => sum + bill.total, 0))}
              </p>
              <p className="stat-label">Outstanding</p>
            </div>
          </div>
          
          <div className="billing-table-container">
            {loading ? (
              <div className="loading">Loading billing data...</div>
            ) : filteredBills.length === 0 ? (
              <div className="no-data">No bills found.</div>
            ) : (
              <table className="billing-table">
                <thead>
                  <tr>
                    <th>Bill Number</th>
                    <th>Retailer</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill) => (
                    <tr key={bill._id} className={`status-${bill.status}`}>
                      <td>{bill.billNumber}</td>
                      <td>{bill.retailer.name}</td>
                      <td>{bill.issueDate}</td>
                      <td>{bill.dueDate}</td>
                      <td>{formatCurrency(bill.total)}</td>
                      <td>
                        <span className={`status-badge ${bill.status}`}>
                          {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="view-button"
                            onClick={() => handleViewInvoice(bill)}
                          >
                            View
                          </button>
                          <button 
                            className="print-button"
                            onClick={() => handlePrintInvoice(bill)}
                          >
                            Print
                          </button>
                          {bill.status !== 'paid' && (
                            <button 
                              className="mark-paid-button"
                              onClick={() => handleUpdateStatus(bill._id, 'paid')}
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {showInvoiceModal && selectedBill && (
            <div className="invoice-modal">
              <div className="invoice-modal-content">
                <div className="invoice-modal-header">
                  <h2>Invoice {selectedBill.billNumber}</h2>
                  <button 
                    className="close-button"
                    onClick={() => setShowInvoiceModal(false)}
                  >
                    ×
                  </button>
                </div>
                
                <div className="invoice-body">
                  <div className="invoice-company-details">
                    <h3>Your Distribution Company</h3>
                    <p>123 Distribution Lane, Business Park</p>
                    <p>Phone: (555) 123-4567</p>
                    <p>Email: accounts@distributor.com</p>
                    <p>Tax ID: 123-45-6789</p>
                  </div>
                  
                  <div className="invoice-info">
                    <div className="invoice-to">
                      <h4>Bill To:</h4>
                      <p><strong>{selectedBill.retailer.name}</strong></p>
                      <p>{selectedBill.retailer.address}</p>
                      <p>Phone: {selectedBill.retailer.phone}</p>
                      <p>Email: {selectedBill.retailer.email}</p>
                    </div>
                    
                    <div className="invoice-details">
                      <div className="invoice-detail-row">
                        <span>Invoice Number:</span>
                        <span>{selectedBill.billNumber}</span>
                      </div>
                      <div className="invoice-detail-row">
                        <span>Issue Date:</span>
                        <span>{selectedBill.issueDate}</span>
                      </div>
                      <div className="invoice-detail-row">
                        <span>Due Date:</span>
                        <span>{selectedBill.dueDate}</span>
                      </div>
                      <div className="invoice-detail-row">
                        <span>Status:</span>
                        <span className={`status-badge ${selectedBill.status}`}>
                          {selectedBill.status.charAt(0).toUpperCase() + selectedBill.status.slice(1)}
                        </span>
                      </div>
                      {selectedBill.paymentDate && (
                        <div className="invoice-detail-row">
                          <span>Payment Date:</span>
                          <span>{selectedBill.paymentDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <table className="invoice-items-table">
                    <thead>
                      <tr>
                        <th>Product ID</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBill.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.productId}</td>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.unitPrice)}</td>
                          <td>{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="invoice-totals">
                    <div className="invoice-total-row">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedBill.subtotal)}</span>
                    </div>
                    <div className="invoice-total-row">
                      <span>Tax:</span>
                      <span>{formatCurrency(selectedBill.tax)}</span>
                    </div>
                    <div className="invoice-total-row">
                      <span>Discount:</span>
                      <span>-{formatCurrency(selectedBill.discount)}</span>
                    </div>
                    <div className="invoice-total-row grand-total">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedBill.total)}</span>
                    </div>
                  </div>
                  
                  {selectedBill.notes && (
                    <div className="invoice-notes">
                      <h4>Notes</h4>
                      <p>{selectedBill.notes}</p>
                    </div>
                  )}
                  
                  <div className="invoice-footer">
                    <p>Thank you for your business!</p>
                    <p>Payment Terms: Net 30 days</p>
                    <p>Please include invoice number with payment</p>
                  </div>
                </div>
                
                <div className="invoice-modal-actions">
                  <button 
                    className="print-invoice-button"
                    onClick={() => handlePrintInvoice(selectedBill)}
                  >
                    Print Invoice
                  </button>
                  {selectedBill.status !== 'paid' && (
                    <button 
                      className="mark-paid-button"
                      onClick={() => {
                        handleUpdateStatus(selectedBill._id, 'paid');
                        setSelectedBill({...selectedBill, status: 'paid'});
                      }}
                    >
                      Mark as Paid
                    </button>
                  )}
                  <button 
                    className="close-invoice-button"
                    onClick={() => setShowInvoiceModal(false)}
                  >
                    Close
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

export default Billing; 