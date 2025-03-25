import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Sidebar from './shared/Sidebar';
import NotificationsPanel from './shared/NotificationsPanel';
import './styles/Dashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Mock data
const MOCK_DATA = {
  organization: {
    name: "TechInventory Solutions",
    gstNumber: "29AAACT2727Q1ZP"
  },
  stats: {
    totalRevenue: 125000,
    totalOrders: 450,
    totalProducts: 120,
    lowStockItems: 8
  },
  insights: [
    {
      id: 1,
      title: "Low stock alert",
      description: "8 products are below reorder levels and need immediate attention.",
      actionLink: "/inventory",
      actionText: "View inventory"
    },
    {
      id: 2,
      title: "Sales growth",
      description: "Monthly sales have increased by 15% compared to previous month.",
      actionLink: "/orders",
      actionText: "Check sales report"
    },
    {
      id: 3,
      title: "Popular categories",
      description: "Electronics category accounts for 45% of your total revenue this month.",
      actionLink: "/inventory",
      actionText: "View categories"
    }
  ],
  salesVsDemand: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [12000, 19000, 15000, 22000, 18000, 24000],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: false
      },
      {
        label: 'Demand',
        data: [15000, 22000, 18000, 25000, 21000, 27000],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        fill: false
      }
    ]
  },
  revenueProfitTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [25000, 30000, 28000, 35000, 32000, 40000],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Profit',
        data: [10000, 12000, 11200, 14000, 12800, 16000],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      }
    ]
  },
  categoryPerformance: {
    labels: ['Electronics', 'Furniture', 'Office Supplies', 'Storage', 'Other'],
    datasets: [
      {
        label: 'Revenue',
        data: [45000, 32000, 21000, 16000, 11000],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(244, 63, 94, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  },
  topProducts: {
    labels: ['Laptop Dell XPS', 'Office Chair', 'Wireless Mouse', 'Desk Lamp', 'Filing Cabinet'],
    datasets: [
      {
        label: 'Units Sold',
        data: [52, 45, 68, 34, 28],
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1
      },
      {
        label: 'Profit ($)',
        data: [5200, 2250, 1700, 850, 1400],
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 1
      }
    ]
  },
  expectedVsActual: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Expected Revenue',
        data: [60000, 70000, 85000, 110000],
        backgroundColor: 'rgba(59, 130, 246, 0.4)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Actual Revenue',
        data: [70000, 82000, 95000, 120000],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      }
    ]
  },
  stockAlerts: [
    { id: 1, name: 'Laptop Dell XPS', current: 5, threshold: 10, category: 'Electronics' },
    { id: 2, name: 'Wireless Mouse', current: 8, threshold: 15, category: 'Electronics' },
    { id: 3, name: 'Office Chair', current: 3, threshold: 10, category: 'Furniture' },
    { id: 4, name: 'Desk Lamp', current: 4, threshold: 8, category: 'Office Supplies' },
    { id: 5, name: 'Filing Cabinet', current: 2, threshold: 5, category: 'Storage' }
  ]
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [organization] = useState(MOCK_DATA.organization);
  const [stats] = useState(MOCK_DATA.stats);
  const [insights] = useState(MOCK_DATA.insights);
  const [salesVsDemand] = useState(MOCK_DATA.salesVsDemand);
  const [revenueProfitTrend] = useState(MOCK_DATA.revenueProfitTrend);
  const [topProducts] = useState(MOCK_DATA.topProducts);
  const [categoryPerformance] = useState(MOCK_DATA.categoryPerformance);
  const [expectedVsActual] = useState(MOCK_DATA.expectedVsActual);
  const [stockAlerts] = useState(MOCK_DATA.stockAlerts);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mockUser');
    navigate('/login');
  };

  // Update sidebar collapsed state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setSidebarCollapsed(localStorage.getItem('sidebarCollapsed') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Use the shared Sidebar component */}
      <Sidebar />

      {/* Main content */}
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="dashboard-header">
          <div className="organization-info">
            <h1>Dashboard</h1>
            <div className="org-details">
              <p className="org-name">{organization.name}</p>
              <p className="org-gst">GST: {organization.gstNumber}</p>
            </div>
          </div>
          <div className="user-info">
            <NotificationsPanel />
            <span className="user-name">Admin User</span>
            <span className="user-avatar">👤</span>
          </div>
        </div>
        
        <div className="scrollable-content">
          {/* Stats Overview */}
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon revenue">💰</div>
              <div className="stat-details">
                <h3 className="stat-title">Total Revenue</h3>
                <p className="stat-value">${stats.totalRevenue.toLocaleString()}</p>
                <p className="stat-subtext">Per Annum</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orders">🛍️</div>
              <div className="stat-details">
                <h3 className="stat-title">Total Orders</h3>
                <p className="stat-value">{stats.totalOrders}</p>
                <p className="stat-subtext">Per Month</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon products">📦</div>
              <div className="stat-details">
                <h3 className="stat-title">Total Products</h3>
                <p className="stat-value">{stats.totalProducts}</p>
                <p className="stat-subtext">In Inventory</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon low-stock">⚠️</div>
              <div className="stat-details">
                <h3 className="stat-title">Low Stock Items</h3>
                <p className="stat-value">{stats.lowStockItems}</p>
                <p className="stat-subtext">Need Attention</p>
              </div>
            </div>
          </div>

          {/* Stock Alerts Section */}
          <div className="stock-alerts-section">
            <h2>Stock Alerts</h2>
            <div className="stock-alerts-list">
              {stockAlerts.map((alert) => (
                <div key={alert.id} className="stock-alert-item">
                  <div className="stock-alert-icon">⚠️</div>
                  <div className="stock-alert-details">
                    <h3 className="stock-alert-name">{alert.name}</h3>
                    <p className="stock-alert-category">{alert.category}</p>
                    <div className="stock-alert-levels">
                      <span className="current-level">Current: <strong>{alert.current}</strong></span>
                      <span className="threshold-level">Threshold: <strong>{alert.threshold}</strong></span>
                    </div>
                  </div>
                  <Link to="/inventory" className="stock-alert-action">Restock</Link>
                </div>
              ))}
            </div>
          </div>

          {/* Main Chart - Sales vs Demand */}
          <div className="chart-card main-chart">
            <h2>Sales vs. Demand Trend</h2>
            <Line 
              data={salesVsDemand} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    align: 'end',
                  }
                }
              }} 
            />
          </div>

          {/* Business Insights - Now after sales vs demand chart */}
          <div className="business-insights">
            <h2>Business Insights</h2>
            <div className="insights-list">
              {insights.map((insight) => (
                <div key={insight.id} className="insight-card">
                  <div className="insight-icon">💡</div>
                  <div className="insight-content">
                    <h3 className="insight-title">{insight.title}</h3>
                    <p className="insight-description">{insight.description}</p>
                    <Link to={insight.actionLink} className="insight-action">
                      {insight.actionText}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Grid - 2x2 layout */}
          <div className="charts-grid">
            <div className="chart-card">
              <h2>Revenue & Profit</h2>
              <Bar 
                data={revenueProfitTrend} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      align: 'end',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
            
            <div className="chart-card">
              <h2>Expected vs. Actual Revenue</h2>
              <Bar 
                data={expectedVsActual} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      align: 'end',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
            
            <div className="chart-card">
              <h2>Revenue by Category</h2>
              <Pie 
                data={categoryPerformance} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: $${context.raw.toLocaleString()} (${context.parsed}%)`;
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
            
            <div className="chart-card">
              <h2>Top Products: Units Sold & Profit</h2>
              <Bar 
                data={topProducts} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  plugins: {
                    legend: {
                      position: 'top',
                      align: 'end',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          if (context.dataset.label === 'Profit ($)') {
                            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                          }
                          return `${context.dataset.label}: ${context.raw}`;
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
          
          {/* Top selling products description */}
          <div className="top-products-description">
            <h3>About Top Selling Products</h3>
            <p>
              The Top Selling Products chart shows your best performing inventory items based on sales volume over the last 30 days. 
              This data helps identify market trends and informs restocking decisions. Products are ranked by units sold, 
              with the length of each bar representing relative sales volume.
            </p>
            <div className="product-stats-highlight">
              <div className="stat-highlight">
                <span className="highlight-number">67%</span>
                <span className="highlight-text">of total revenue comes from top 5 products</span>
              </div>
              <div className="stat-highlight">
                <span className="highlight-number">3.2x</span>
                <span className="highlight-text">higher profit margin on top products vs average</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 