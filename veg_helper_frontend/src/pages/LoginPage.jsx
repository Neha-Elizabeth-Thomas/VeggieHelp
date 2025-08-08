import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth


const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors.form) setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await api.post('/users/login', formData);
      const user = response.data;

      login(user); 
      // Redirect based on user type
      if (user.userType === 'farmer') {
        navigate('/farmer/dashboard');
      } else if (user.userType === 'buyer') {
        navigate('/buyer/dashboard'); // Future route for buyers
      } else if (user.userType === 'admin') {
        // navigate('/admin/dashboard'); // Future route for admins
      } else {
        navigate('/'); // Fallback
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrors({ form: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-600 py-4 px-6">
          <h1 className="text-2xl font-bold text-white text-center">Login to VeggieHelp</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {errors.form && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <p>{errors.form}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input name="email" type="email" placeholder="you@example.com" className="w-full p-3 border rounded-md" value={formData.email} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" type="password" placeholder="••••••••" className="w-full p-3 border rounded-md" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md disabled:opacity-70">
              {isSubmitting ? 'Logging In...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;