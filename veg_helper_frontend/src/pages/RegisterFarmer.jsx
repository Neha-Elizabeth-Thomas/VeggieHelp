import React, { useState } from 'react';

const RegisterFarmer = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    village: '',
    district: '',
    state: '',
    pincode: '',
    aadhaar: '',
    landSize: '',
    produceTypes: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const produceOptions = ['Tomato', 'Potato', 'Onion', 'Cabbage', 'Cauliflower', 'Beans'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.village.trim()) newErrors.village = 'Village is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode';
    if (formData.aadhaar && !/^\d{12}$/.test(formData.aadhaar)) newErrors.aadhaar = 'Aadhaar must be 12 digits';
    if (!formData.landSize) newErrors.landSize = 'Land size is required';
    if (formData.produceTypes.length === 0) newErrors.produceTypes = 'Select at least one produce type';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckbox = (value) => {
    setFormData(prev => ({
      ...prev,
      produceTypes: prev.produceTypes.includes(value)
        ? prev.produceTypes.filter(item => item !== value)
        : [...prev.produceTypes, value]
    }));
    // Clear error when user selects at least one checkbox
    if (errors.produceTypes && (formData.produceTypes.length > 0 || !formData.produceTypes.includes(value))) {
      setErrors(prev => ({ ...prev, produceTypes: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Farmer Registration Data:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        fullName: '',
        phone: '',
        village: '',
        district: '',
        state: '',
        pincode: '',
        aadhaar: '',
        landSize: '',
        produceTypes: [],
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-600 py-4 px-6">
          <h1 className="text-2xl font-bold text-white">Farmer Registration</h1>
          <p className="text-green-100">Join our agricultural network</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {submitSuccess && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
              <p className="font-bold">Registration Successful!</p>
              <p>Thank you for registering with us.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                name="fullName"
                placeholder="Enter full name"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                name="phone"
                placeholder="Enter 10-digit phone number"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Village/Town *</label>
              <input
                name="village"
                placeholder="Enter village or town"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.village ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.village}
                onChange={handleChange}
              />
              {errors.village && <p className="mt-1 text-sm text-red-600">{errors.village}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
              <input
                name="district"
                placeholder="Enter district"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.district ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.district}
                onChange={handleChange}
              />
              {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input
                name="state"
                placeholder="Enter state"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.state}
                onChange={handleChange}
              />
              {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
              <input
                name="pincode"
                placeholder="Enter 6-digit pincode"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.pincode}
                onChange={handleChange}
                maxLength="6"
              />
              {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
              <input
                name="aadhaar"
                placeholder="Enter 12-digit Aadhaar (optional)"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.aadhaar ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.aadhaar}
                onChange={handleChange}
                maxLength="12"
              />
              {errors.aadhaar && <p className="mt-1 text-sm text-red-600">{errors.aadhaar}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Land Size (in acres) *</label>
              <input
                name="landSize"
                placeholder="Enter land size"
                type="number"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.landSize ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.landSize}
                onChange={handleChange}
                min="0"
                step="0.1"
              />
              {errors.landSize && <p className="mt-1 text-sm text-red-600">{errors.landSize}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Types of Produce Grown *</label>
            {errors.produceTypes && <p className="mt-1 text-sm text-red-600 mb-2">{errors.produceTypes}</p>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {produceOptions.map(option => (
                <label key={option} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.produceTypes.includes(option)}
                    onChange={() => handleCheckbox(option)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Submit Registration'}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            * Required fields. Your information will be kept secure and used only for agricultural purposes.
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterFarmer;