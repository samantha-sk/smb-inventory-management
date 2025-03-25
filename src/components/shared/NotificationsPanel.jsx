import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotificationsPanel.css';

const MOCK_NOTIFICATIONS = [
  { id: 1, message: "Low stock alert: Product X is below threshold", type: "warning", time: "2 hours ago" },
  { id: 2, message: "New order received #123", type: "info", time: "3 hours ago" },
  { id: 3, message: "Monthly sales target achieved!", type: "success", time: "Yesterday" },
  { id: 4, message: "Product Y is out of stock", type: "warning", time: "Yesterday" },
  { id: 5, message: "New seller registration approved", type: "success", time: "2 days ago" }
];

const NotificationsPanel = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState(MOCK_NOTIFICATIONS);
  
  return (
    <div className="notifications-wrapper">
      <button 
        className="notifications-button"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <span className="notifications-icon">🕒</span>
        <span className="notifications-count">{notifications.length}</span>
      </button>
      
      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button className="close-button" onClick={() => setShowNotifications(false)}>
              ✕
            </button>
          </div>
          <div className="notifications-list">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.type}`}
              >
                <div className="notification-icon">
                  {notification.type === 'warning' ? '⚠️' : 
                   notification.type === 'success' ? '✅' : 'ℹ️'}
                </div>
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="notifications-footer">
            <Link to="/notifications">View All</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel; 