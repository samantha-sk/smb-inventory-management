import React, { useState } from 'react';
import Sidebar from './shared/Sidebar';
import './styles/Archives.css';

// Mock archived data
const MOCK_ARCHIVED_PRODUCTS = [
  { id: 1, name: 'HP Pavilion Laptop', sku: 'LT-HP-001', category: 'Laptop', lastUpdated: '2023-09-15', archivedBy: 'Admin', reason: 'Discontinued' },
  { id: 2, name: 'Mechanical Keyboard', sku: 'KB-MK-002', category: 'Accessories', lastUpdated: '2023-10-21', archivedBy: 'Manager', reason: 'Replaced by newer model' },
  { id: 3, name: 'Gaming Mouse', sku: 'MS-GM-003', category: 'Accessories', lastUpdated: '2023-08-30', archivedBy: 'Sales', reason: 'Low demand' },
  { id: 4, name: 'USB Hub', sku: 'AC-UH-004', category: 'Accessories', lastUpdated: '2023-07-15', archivedBy: 'Admin', reason: 'Defective batch' },
  { id: 5, name: 'Office Desk', sku: 'FN-OD-005', category: 'Furniture', lastUpdated: '2023-09-05', archivedBy: 'Inventory', reason: 'No longer available from supplier' }
];

const MOCK_ARCHIVED_ORDERS = [
  { id: 1, orderNumber: 'ORD-2023-0501', customer: 'TechCorp Inc', date: '2023-05-01', total: 2499.98, archivedDate: '2023-11-15', archivedBy: 'System', reason: 'Completed and delivered' },
  { id: 2, orderNumber: 'ORD-2023-0625', customer: 'Office Solutions', date: '2023-06-25', total: 1299.97, archivedDate: '2023-11-20', archivedBy: 'Sales Manager', reason: 'Customer cancelled' },
  { id: 3, orderNumber: 'ORD-2023-0712', customer: 'Creative Studio', date: '2023-07-12', total: 799.99, archivedDate: '2023-11-25', archivedBy: 'System', reason: 'Completed and delivered' }
];

const MOCK_ARCHIVED_INVOICES = [
  { id: 1, invoiceNumber: 'INV-2023-0501', customer: 'TechCorp Inc', date: '2023-05-01', amount: 2499.98, status: 'Paid', archivedDate: '2023-11-15', archivedBy: 'Finance', reason: 'Paid and completed' },
  { id: 2, invoiceNumber: 'INV-2023-0625', customer: 'Office Solutions', date: '2023-06-25', amount: 1299.97, status: 'Void', archivedDate: '2023-11-20', archivedBy: 'Finance', reason: 'Order cancelled' },
  { id: 3, invoiceNumber: 'INV-2023-0712', customer: 'Creative Studio', date: '2023-07-12', amount: 799.99, status: 'Paid', archivedDate: '2023-11-25', archivedBy: 'System', reason: '90 days old' }
];

const Archives = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('');
  
  // Filter options
  const categories = ['All', 'Products', 'Orders', 'Invoices'];
  const dateRanges = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 30 Days', value: '30days' },
    { label: 'Last 3 Months', value: '3months' },
    { label: 'Last 6 Months', value: '6months' },
    { label: 'Last 12 Months', value: '12months' }
  ];
  
  // Filter products
  const filteredProducts = MOCK_ARCHIVED_PRODUCTS.filter(product => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
           product.category.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Filter orders
  const filteredOrders = MOCK_ARCHIVED_ORDERS.filter(order => {
    return order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
           order.customer.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Filter invoices
  const filteredInvoices = MOCK_ARCHIVED_INVOICES.filter(invoice => {
    return invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
           invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Restore item
  const handleRestore = (type, id) => {
    alert(`Restoring ${type} with ID ${id}`);
    // In a real application, you would remove from archive and restore to active state
  };
  
  // Delete item permanently
  const handleDelete = (type, id) => {
    if (window.confirm(`Are you sure you want to permanently delete this ${type}? This action cannot be undone.`)) {
      alert(`Permanently deleting ${type} with ID ${id}`);
      // In a real application, you would remove from database entirely
    }
  };
  
  // Export archives
  const exportArchives = (format) => {
    alert(`Exporting ${activeTab} archives in ${format} format`);
    // In a real implementation, this would generate and download the file
  };
  
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="content-container">
          <div className="page-header">
            <h1>Archives</h1>
          </div>
          
          {/* Tabs */}
          <div className="archives-tabs">
            <button
              className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button
              className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
            <button
              className={`tab-button ${activeTab === 'invoices' ? 'active' : ''}`}
              onClick={() => setActiveTab('invoices')}
            >
              Invoices
            </button>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="archives-filter">
            <div className="search-filter-bar">
              <input
                type="text"
                className="search-input"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="filter-select"
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
              >
                <option value="">All Time</option>
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
            <div className="export-options">
              <button className="export-button" onClick={() => exportArchives('csv')}>Export CSV</button>
              <button className="export-button" onClick={() => exportArchives('excel')}>Export Excel</button>
              <button className="export-button" onClick={() => exportArchives('pdf')}>Export PDF</button>
            </div>
          </div>
          
          {/* Content based on active tab */}
          <div className="archives-content">
            {activeTab === 'products' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Archived By
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.lastUpdated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.archivedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleRestore('product', product.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Restore
                            </button>
                            <button 
                              onClick={() => handleDelete('product', product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Archived Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Archived By
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.archivedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.archivedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleRestore('order', order.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Restore
                            </button>
                            <button 
                              onClick={() => handleDelete('order', order.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'invoices' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Archived Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Archived By
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${invoice.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.archivedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.archivedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleRestore('invoice', invoice.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Restore
                            </button>
                            <button 
                              onClick={() => handleDelete('invoice', invoice.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Show message if no data */}
            {((activeTab === 'products' && filteredProducts.length === 0) ||
              (activeTab === 'orders' && filteredOrders.length === 0) ||
              (activeTab === 'invoices' && filteredInvoices.length === 0)) && (
              <div className="py-10 text-center">
                <p className="text-gray-500">No archived {activeTab} found.</p>
              </div>
            )}
          </div>
          
          {/* Archive Policy Section */}
          <div className="archive-policy">
            <h2>Archive Policy</h2>
            <div className="policy-content">
              <p>Items in the archive are retained for the following periods:</p>
              <ul>
                <li>Products: 1 year after archiving</li>
                <li>Orders: 3 years after completion</li>
                <li>Invoices: 7 years after payment (for compliance with tax regulations)</li>
              </ul>
              <p>After these periods, data may be permanently deleted from the system. To retain data longer, please export it before the retention period ends.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Archives; 