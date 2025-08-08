// File: client/src/pages/RegisterFarmer.jsx
import React, { useState } from 'react';
import api from '../services/api'; // Import your centralized api service

const RegisterFarmer = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    village: '',
    district: '',
    state: '',
    pincode: '',
    aadhaar: '',
    landSize: '',
    produceTypes: [],
    location: null, // To store { type: 'Point', coordinates: [lon, lat] }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [locationError, setLocationError] = useState('');

  const produceOptions = ['Tomato', 'Potato', 'Onion', 'Cabbage', 'Cauliflower', 'Beans'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Valid 10-digit phone number is required';
    if (!formData.village.trim()) newErrors.village = 'Village is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Valid 6-digit pincode is required';
    if (formData.aadhaar && !/^\d{12}$/.test(formData.aadhaar)) newErrors.aadhaar = 'Aadhaar must be 12 digits';
    if (!formData.landSize) newErrors.landSize = 'Land size is required';
    if (formData.produceTypes.length === 0) newErrors.produceTypes = 'Select at least one produce type';
    if (!formData.location) newErrors.location = 'Location is required. Please use the button to get your location.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCheckbox = (value) => {
    setFormData(prev => ({
      ...prev,
      produceTypes: prev.produceTypes.includes(value)
        ? prev.produceTypes.filter(item => item !== value)
        : [...prev.produceTypes, value]
    }));
    if (errors.produceTypes) setErrors(prev => ({ ...prev, produceTypes: '' }));
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
        (error) => {
          setLocationError(`Error: ${error.message}. Please enable location services.`);
        }
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

    const submissionData = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      village: formData.village,
      district: formData.district,
      state: formData.state,
      pincode: formData.pincode,
      aadhaar: formData.aadhaar,
      landSize: formData.landSize,
      produceTypes: formData.produceTypes,
      location: formData.location,
      userType: 'farmer',
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
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-600 py-4 px-6">
          <h1 className="text-2xl font-bold text-white">Farmer Registration</h1>
          <p className="text-green-100">Join our agricultural network</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {submitSuccess && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">Registration Successful! You can now log in.</div>}
          {errors.form && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">{errors.form}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input name="fullName" placeholder="Enter full name" className={`w-full p-3 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} value={formData.fullName} onChange={handleChange} />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input name="email" type="email" placeholder="you@example.com" className={`w-full p-3 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`} value={formData.email} onChange={handleChange} />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input name="password" type="password" placeholder="Minimum 6 characters" className={`w-full p-3 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`} value={formData.password} onChange={handleChange} />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input name="phone" placeholder="Enter 10-digit phone number" className={`w-full p-3 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} value={formData.phone} onChange={handleChange} maxLength="10" />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Village/Town *</label>
              <input name="village" placeholder="Enter village or town" className={`w-full p-3 border rounded-md ${errors.village ? 'border-red-500' : 'border-gray-300'}`} value={formData.village} onChange={handleChange} />
              {errors.village && <p className="mt-1 text-sm text-red-600">{errors.village}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
              <input name="district" placeholder="Enter district" className={`w-full p-3 border rounded-md ${errors.district ? 'border-red-500' : 'border-gray-300'}`} value={formData.district} onChange={handleChange} />
              {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input name="state" placeholder="Enter state" className={`w-full p-3 border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300'}`} value={formData.state} onChange={handleChange} />
              {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
              <input name="pincode" placeholder="Enter 6-digit pincode" className={`w-full p-3 border rounded-md ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`} value={formData.pincode} onChange={handleChange} maxLength="6" />
              {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
              <input name="aadhaar" placeholder="Enter 12-digit Aadhaar (optional)" className={`w-full p-3 border rounded-md ${errors.aadhaar ? 'border-red-500' : 'border-gray-300'}`} value={formData.aadhaar} onChange={handleChange} maxLength="12" />
              {errors.aadhaar && <p className="mt-1 text-sm text-red-600">{errors.aadhaar}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Land Size (in acres) *</label>
              <input name="landSize" placeholder="Enter land size" type="number" className={`w-full p-3 border rounded-md ${errors.landSize ? 'border-red-500' : 'border-gray-300'}`} value={formData.landSize} onChange={handleChange} min="0" step="0.1" />
              {errors.landSize && <p className="mt-1 text-sm text-red-600">{errors.landSize}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Types of Produce Grown *</label>
            {errors.produceTypes && <p className="mt-1 text-sm text-red-600 mb-2">{errors.produceTypes}</p>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {produceOptions.map(option => (
                <label key={option} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100">
                  <input type="checkbox" checked={formData.produceTypes.includes(option)} onChange={() => handleCheckbox(option)} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <button type="button" onClick={handleGetLocation} className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Get My Current Location
            </button>
            {formData.location && <p className="mt-2 text-sm text-green-600">Location captured successfully!</p>}
            {locationError && <p className="mt-1 text-sm text-red-600">{locationError}</p>}
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isSubmitting ? 'Processing...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterFarmer;
