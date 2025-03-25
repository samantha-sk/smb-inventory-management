import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import AddProduct from './components/AddProduct';
import DamageReturns from './components/DamageReturns';
import Billing from './components/Billing';
import Orders from './components/Orders';
import Archives from './components/Archives';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './components/styles/App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  // First check current user from AuthContext
  const { currentUser } = useAuth();
  
  // If no current user, check localStorage as fallback - with safe parsing
  let storedUser = null;
  try {
    const storedUserData = localStorage.getItem('mockUser');
    if (storedUserData) {
      storedUser = JSON.parse(storedUserData);
    }
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    storedUser = null;
  }
  
  console.log("Protected route check:", { currentUser, storedUser });
  
  if (!currentUser && !storedUser) {
    console.log("No authenticated user found, redirecting to login");
    return <Navigate to="/login" />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/inventory" 
        element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/add-product" 
        element={
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/damage-returns" 
        element={
          <ProtectedRoute>
            <DamageReturns />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/billing" 
        element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/archives" 
        element={
          <ProtectedRoute>
            <Archives />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App; 