import React, { useState } from 'react';

const AddListing = () => {
  const [formData, setFormData] = useState({ 
    produce: '', 
    quantity: '', 
    price: '',
    image: null,
    imagePreview: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const data = new FormData();
      data.append('produce', formData.produce);
      data.append('quantity', formData.quantity);
      data.append('price', formData.price);
      data.append('image', formData.image);

      const res = await fetch('/api/listing', {
        method: 'POST',
        body: data,
      });
      
      const result = await res.json();
      
      if (res.ok) {
        setMessage({ text: result.message || 'Listing added successfully!', type: 'success' });
        // Reset form on success
        setFormData({ 
          produce: '', 
          quantity: '', 
          price: '',
          image: null,
          imagePreview: null
        });
      } else {
        setMessage({ text: result.message || 'Error adding listing', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 my-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add Surplus Produce</h2>
        <p className="text-gray-600 mt-1">List your extra produce to connect with buyers</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Upload Preview */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
            {formData.imagePreview ? (
              <img 
                src={formData.imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          <label className="cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Image
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
              required 
            />
          </label>
        </div>

        {/* Produce Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Produce Name</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="e.g. Tomatoes, Apples, etc." 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              value={formData.produce}
              onChange={e => setFormData({ ...formData, produce: e.target.value })}
              required 
            />
          </div>
        </div>

        {/* Quantity and Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
            <input 
              type="number" 
              placeholder="0" 
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹/kg)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">₹</span>
              <input 
                type="number" 
                placeholder="0" 
                min="1"
                className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                required 
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center gap-2 ${
            isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Listing
            </>
          )}
        </button>

        {/* Message */}
        {message.text && (
          <div className={`mt-4 p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddListing;