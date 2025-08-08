import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 

// Import page components
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterFarmer from './pages/RegisterFarmer';
import RegisterBuyer from './pages/RegisterBuyer';
import FarmerDashboard from './pages/FarmerDashboard';
import AddListing from './pages/AddListing';
import FarmerProfile from './pages/FarmerProfile';
import BuyerDashboard from './pages/BuyerDashboardPage'; // Import BuyerDashboard
import CartPage from './pages/CartPage'; // Import CartPage
import BuyerProfile from './pages/BuyerProfile'; // 1. Import BuyerProfile

function App() {
  return (
    <div className="App">
      <Header /> 
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-farmer" element={<RegisterFarmer />} />
          <Route path="/register-buyer" element={<RegisterBuyer />} />
          
          {/* Farmer Routes */}
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer/add-listing" element={<AddListing />} />
          <Route path="/farmer/profile" element={<FarmerProfile />} />

          {/* Buyer Routes */}
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/buyer/profile" element={<BuyerProfile />} /> {/* 2. Add BuyerProfile route */}

        </Routes>
      </main>
    </div>
  );
}

export default App;