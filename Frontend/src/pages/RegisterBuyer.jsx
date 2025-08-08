// File: client/src/pages/RegisterBuyer.jsx

import React, { useState } from 'react';
import api from '../services/api'; // Your centralized API service

const RegisterBuyer = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    location: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [locationError, setLocationError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Valid 10-digit phone number is required';
    if (!formData.location) newErrors.location = 'Location is required. Please use the button to get your location.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleGetLocation = () => {
    setLocationError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: { type: 'Point', coordinates: [longitude, latitude] }
          }));
          if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
        },
        (error) => setLocationError(`Error: ${error.message}. Please enable location services.`)
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setErrors({});

    const submissionData = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      location: formData.location,
      userType: 'buyer', // Set userType to 'buyer'
    };

    try {
      await api.post('/users/register', submissionData);
      setSubmitSuccess(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ form: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 py-4 px-6">
          <h1 className="text-2xl font-bold text-white">Buyer Registration</h1>
          <p className="text-blue-100">Find fresh produce directly from local farmers</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {submitSuccess && <div className="bg-green-100 text-green-700 p-4 rounded-md">Registration Successful! You can now log in.</div>}
          {errors.form && <div className="bg-red-100 text-red-700 p-4 rounded-md">{errors.form}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name / Business Name *</label>
            <input name="fullName" placeholder="e.g., Adiga's Restaurant" className={`w-full p-3 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} value={formData.fullName} onChange={handleChange} />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input name="email" type="email" placeholder="you@example.com" className={`w-full p-3 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`} value={formData.email} onChange={handleChange} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input name="password" type="password" placeholder="Minimum 6 characters" className={`w-full p-3 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`} value={formData.password} onChange={handleChange} />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
            <input name="phone" placeholder="10-digit phone number" className={`w-full p-3 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} value={formData.phone} onChange={handleChange} maxLength="10" />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Location *</label>
            <button type="button" onClick={handleGetLocation} className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Get My Current Location
            </button>
            {formData.location && <p className="mt-2 text-sm text-green-600">Location captured successfully!</p>}
            {locationError && <p className="mt-1 text-sm text-red-600">{locationError}</p>}
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-70 disabled:cursor-not-allowed`}>
              {isSubmitting ? 'Registering...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterBuyer;
