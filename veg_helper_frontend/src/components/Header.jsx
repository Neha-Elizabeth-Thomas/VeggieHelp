// File: client/src/components/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const Header = () => {
  const { userInfo, logout: authLogout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // ... existing logout logic
    try {
      await api.post('/users/logout');
      authLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Farmer-specific navigation items
  const farmerNavItems = [
    { name: 'Dashboard', path: '/farmer/dashboard' },
    { name: 'Add Listing', path: '/farmer/add-listing' },
    { name: 'Profile', path: '/farmer/profile' },
  ];
  
  // Buyer-specific navigation items
  const buyerNavItems = [
    { name: 'Shop', path: '/buyer/dashboard' },
    { name: 'Profile', path: '/buyer/profile' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to={userInfo ? (userInfo.userType === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard') : '/'} className="text-2xl font-bold text-green-600">
            VeggieHelp
          </Link>
          
          <div className="flex items-center space-x-4">
            {userInfo ? (
              // --- Logged-in User View ---
              <>
                {userInfo.userType === 'farmer' && farmerNavItems.map(item => (
                  <Link key={item.name} to={item.path} className="text-gray-600 hover:text-green-600 hidden md:inline-block">
                    {item.name}
                  </Link>
                ))}
                
                {userInfo.userType === 'buyer' && 
                  <>
                    {buyerNavItems.map(item => (
                      <Link key={item.name} to={item.path} className="text-gray-600 hover:text-green-600 hidden md:inline-block">
                        {item.name}
                      </Link>
                    ))}
                    <Link to="/cart" className="relative text-gray-600 hover:text-green-600">
                      <span>My Cart</span>
                      {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartItems.reduce((count, item) => count + item.quantity, 0)}
                        </span>
                      )}
                    </Link>
                  </>
                }
                
                <span className="text-gray-700 hidden lg:block">Welcome, {userInfo.name.split(' ')[0]}!</span>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                  Logout
                </button>
              </>
            ) : (
              // --- Logged-out User View ---
              <>
                <Link to="/login" className="text-gray-600 hover:text-green-600">Login</Link>
                <Link to="/register-farmer" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  Register as Farmer
                </Link>
                <Link to="/register-buyer" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Register as Buyer
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
