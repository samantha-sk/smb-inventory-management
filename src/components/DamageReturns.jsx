import React, { useState } from 'react';
import Sidebar from './shared/Sidebar';
import './styles/DamageReturns.css';

// Mock data for damage and returns
const MOCK_DAMAGE_RETURNS = [
  {
    id: 1,
    invoiceNo: 'INV-2023-001',
    orderDate: '2023-09-15',
    deliveryDate: '2023-09-18',
    issue: 'Damaged in Transit',
    product: 'Office Chair',
    quantity: 2,
    returnDate: '2023-09-22',
    description: 'Product arrived with broken armrests',
    status: 'Pending',
    refundAmount: 199.98
  },
  {
    id: 2,
    invoiceNo: 'INV-2023-015',
    orderDate: '2023-09-20',
    deliveryDate: '2023-09-23',
    issue: 'Wrong Item',
    product: 'Desk Lamp',
    quantity: 1,
    returnDate: '2023-09-25',
    description: 'Received black lamp instead of white',
    status: 'Processed',
    refundAmount: 45.99
  },
  {
    id: 3,
    invoiceNo: 'INV-2023-022',
    orderDate: '2023-10-01',
    deliveryDate: '2023-10-04',
    issue: 'Defective Product',
    product: 'Wireless Mouse',
    quantity: 3,
    returnDate: '2023-10-08',
    description: 'Connectivity issues with all three mice',
    status: 'Rejected',
    refundAmount: 89.97
  },
  {
    id: 4,
    invoiceNo: 'INV-2023-030',
    orderDate: '2023-10-10',
    deliveryDate: '2023-10-13',
    issue: 'Customer Changed Mind',
    product: 'Whiteboard',
    quantity: 1,
    returnDate: '2023-10-15',
    description: 'Customer found a cheaper alternative',
    status: 'Pending',
    refundAmount: 120.00
  },
  {
    id: 5,
    invoiceNo: 'INV-2023-042',
    orderDate: '2023-10-18',
    deliveryDate: '2023-10-21',
    issue: 'Damaged in Transit',
    product: 'Filing Cabinet',
    quantity: 1,
    returnDate: '2023-10-24',
    description: 'Dented on the side during shipping',
    status: 'Processed',
    refundAmount: 175.50
  }
];

const DamageReturns = () => {
  // State for damage returns data
  const [damageReturns, setDamageReturns] = useState(MOCK_DAMAGE_RETURNS);
  
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // State for form visibility and form data
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNo: '',
    orderDate: '',
    deliveryDate: '',
    issue: '',
    product: '',
    quantity: 1,
    returnDate: '',
    description: '',
    refundAmount: 0
  });
  
  // Dropdown options
  const issueTypes = ['Damaged in Transit', 'Defective Product', 'Wrong Item', 'Customer Changed Mind', 'Other'];
  const statuses = ['Pending', 'Processed', 'Rejected'];
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newReturn = {
        id: damageReturns.length + 1,
        ...formData,
        status: 'Pending'
      };
      
      setDamageReturns([newReturn, ...damageReturns]);
      setFormData({
        invoiceNo: '',
        orderDate: '',
        deliveryDate: '',
        issue: '',
        product: '',
        quantity: 1,
        returnDate: '',
        description: '',
        refundAmount: 0
      });
      setShowForm(false);
      setLoading(false);
    }, 1000);
  };
  
  // Filter damage returns based on search term and status filter
  const filteredReturns = damageReturns.filter(item => {
    const matchesSearch = 
      item.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.issue.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Export data functions
  const exportData = (format) => {
    switch (format) {
      case 'csv':
        alert(`Exporting ${filteredReturns.length} returns as CSV`);
        break;
      case 'excel':
        alert(`Exporting ${filteredReturns.length} returns as Excel`);
        break;
      case 'pdf':
        alert(`Exporting ${filteredReturns.length} returns as PDF`);
        break;
      default:
        break;
    }
  };
  
  // View details function
  const viewDetails = (id) => {
    const item = damageReturns.find(r => r.id === id);
    alert(`Viewing details for return: ${item.invoiceNo} - ${item.product}`);
  };
  
  // Update status function
  const updateStatus = (id) => {
    const item = damageReturns.find(r => r.id === id);
    const newStatus = prompt(`Update status for ${item.invoiceNo} (Pending, Processed, Rejected):`, item.status);
    
    if (newStatus && statuses.includes(newStatus)) {
      const updatedReturns = damageReturns.map(r => 
        r.id === id ? { ...r, status: newStatus } : r
      );
      setDamageReturns(updatedReturns);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="damage-returns-container">
          <div className="damage-returns-header">
            <h1>Damage & Returns Management</h1>
            <button className="add-return-button" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Add New Return'}
            </button>
          </div>
          
          {showForm && (
            <div className="damage-return-form-container">
              <h2 className="form-title">Create New Return</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="invoiceNo">Invoice Number</label>
                    <input
                      type="text"
                      id="invoiceNo"
                      name="invoiceNo"
                      value={formData.invoiceNo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="orderDate">Order Date</label>
                    <input
                      type="date"
                      id="orderDate"
                      name="orderDate"
                      value={formData.orderDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="deliveryDate">Delivery Date</label>
                    <input
                      type="date"
                      id="deliveryDate"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="issue">Issue Type</label>
                    <select
                      id="issue"
                      name="issue"
                      value={formData.issue}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Issue</option>
                      {issueTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="product">Product</label>
                    <input
                      type="text"
                      id="product"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="returnDate">Return Date</label>
                    <input
                      type="date"
                      id="returnDate"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="refundAmount">Refund Amount</label>
                    <input
                      type="number"
                      id="refundAmount"
                      name="refundAmount"
                      min="0"
                      step="0.01"
                      value={formData.refundAmount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="form-buttons">
                  <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    {loading ? 'Processing...' : 'Submit Return'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="search-filter-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search by invoice, product, or issue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map((status, index) => (
                <option key={index} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div className="export-options">
            <button className="export-button" onClick={() => exportData('csv')}>Export CSV</button>
            <button className="export-button" onClick={() => exportData('excel')}>Export Excel</button>
            <button className="export-button" onClick={() => exportData('pdf')}>Export PDF</button>
          </div>
          
          <div className="returns-table-container">
            <table className="returns-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Product</th>
                  <th>Issue</th>
                  <th>Return Date</th>
                  <th>Qty</th>
                  <th>Refund</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturns.map((item) => (
                  <tr key={item.id}>
                    <td>{item.invoiceNo}</td>
                    <td>{item.product}</td>
                    <td>{item.issue}</td>
                    <td>{item.returnDate}</td>
                    <td>{item.quantity}</td>
                    <td>${parseFloat(item.refundAmount).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="view-button" onClick={() => viewDetails(item.id)}>
                          View
                        </button>
                        <button className="update-button" onClick={() => updateStatus(item.id)}>
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamageReturns; 