import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Dashboard.css';

const Sidebar = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );
  const [showDevMessage, setShowDevMessage] = useState(false);

  // Update sidebar collapsed state when localStorage changes (from other components)
  useEffect(() => {
    const handleStorageChange = () => {
      setSidebarCollapsed(localStorage.getItem('sidebarCollapsed') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };
  
  const handleFinBotClick = (e) => {
    e.preventDefault();
    setShowDevMessage(true);
    setTimeout(() => {
      setShowDevMessage(false);
    }, 3000);
  };

  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h1 className="app-name">StockInvent</h1>
        <button className="toggle-button" onClick={toggleSidebar}>
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className={location.pathname === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard">
              <span className="icon">📊</span>
              <span className="menu-text">Dashboard</span>
            </Link>
          </li>
          <li className={location.pathname === '/inventory' ? 'active' : ''}>
            <Link to="/inventory">
              <span className="icon">📦</span>
              <span className="menu-text">Inventory</span>
            </Link>
          </li>
          <li className={location.pathname === '/add-product' ? 'active' : ''}>
            <Link to="/add-product">
              <span className="icon">➕</span>
              <span className="menu-text">Add Product</span>
            </Link>
          </li>
          <li className={location.pathname === '/damage-returns' ? 'active' : ''}>
            <Link to="/damage-returns">
              <span className="icon">🔄</span>
              <span className="menu-text">Damage & Returns</span>
            </Link>
          </li>
          <li className={location.pathname === '/billing' ? 'active' : ''}>
            <Link to="/billing">
              <span className="icon">💵</span>
              <span className="menu-text">Billing</span>
            </Link>
          </li>
          <li className={location.pathname === '/orders' ? 'active' : ''}>
            <Link to="/orders">
              <span className="icon">🛒</span>
              <span className="menu-text">Orders</span>
            </Link>
          </li>
          <li className={location.pathname === '/archives' ? 'active' : ''}>
            <Link to="/archives">
              <span className="icon">🗄️</span>
              <span className="menu-text">Archives</span>
            </Link>
          </li>
          <li className={location.pathname === '/finbot' ? 'active' : ''}>
            <Link to="#" onClick={handleFinBotClick}>
              <span className="icon">🤖</span>
              <span className="menu-text">FinBot</span>
              {showDevMessage && <div className="dev-badge">Under Development</div>}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <Link to="/login" className="logout-button">
          <span className="menu-text">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar; 