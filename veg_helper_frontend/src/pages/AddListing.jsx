// File: client/src/pages/AddListing.jsx

import React, { useState } from 'react';
import api from '../services/api';
import ChatBox from '../components/ChatBox';

const AddListing = () => {
  // State for the initial form (Step 1)
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State for the confirmation data (Step 2)
  const [analysisResult, setAnalysisResult] = useState(null);
  const [price, setPrice] = useState(''); // Allow farmer to edit the suggested price

  // UI/UX State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // --- Step 1: Handle AI Analysis ---
  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text || !image) {
      setError('Please provide a description and an image.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('text', text);
    formData.append('image', image);

    try {
      const response = await api.post('/listings/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAnalysisResult(response.data);
      setPrice(response.data.suggestPrice); // Set initial price from AI suggestion
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- Step 2: Handle Final Submission ---
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // --- CORRECTED: Standardized on produceItem ---
    const finalData = {
      produceItem: analysisResult.categorizeProduct.produceItem, // Corrected property name
      quantity: analysisResult.categorizeProduct.quantity,
      unit: analysisResult.categorizeProduct.unit,
      price: price, // Use the potentially edited price
      imageUrl: analysisResult.imageUrl,
      aiQualityAssessment: analysisResult.assessQuality,
      aiGeneratedAd: analysisResult.generateAd,
    };

    try {
      await api.post('/listings', finalData);
      setSuccess('Your listing has been posted successfully!');
      handleReset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setText('');
    setImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setPrice('');
    setError('');
    setTimeout(() => setSuccess(''), 5000);
  };

  // --- Render Logic ---
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="md:w-2/3 w-full">
        <div className="bg-white p-8 rounded-lg shadow-md">
          
          {!analysisResult ? (
            // --- STEP 1: ANALYSIS FORM ---
            <div>
              <h2 className="text-2xl font-bold text-gray-800 text-center">Create a New Listing</h2>
              <p className="text-gray-600 mt-1 text-center mb-6">Describe your produce, and our AI will do the rest!</p>
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., '30 kilo badiya tamatar hai, aaj hi toda'"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-24 object-cover rounded-md" />
                      ) : (
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} required />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={isAnalyzing} className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md disabled:opacity-70">
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Listing'}
                </button>
              </form>
            </div>
          ) : (
            // --- STEP 2: CONFIRMATION FORM ---
            <div>
              <h2 className="text-2xl font-bold text-gray-800 text-center">Confirm Your Listing</h2>
              <p className="text-gray-600 mt-1 text-center mb-6">Our AI has prepared this listing. Please review and confirm.</p>
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <div className="text-center">
                    <img src={analysisResult.imageUrl} alt="Produce" className="mx-auto h-32 w-32 object-cover rounded-lg shadow-md" />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Categorized Product</h3>
                    <p className="text-gray-700 capitalize">{analysisResult.categorizeProduct.quantity} {analysisResult.categorizeProduct.unit} of {analysisResult.categorizeProduct.produceItem}</p>
                </div>
                 <div>
                    <h3 className="text-lg font-medium text-gray-900">AI Quality Assessment</h3>
                    <p className="text-gray-700 italic">"{analysisResult.assessQuality}"</p>
                </div>
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Suggested Ad</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">"{analysisResult.generateAd}"</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Price (₹ / {analysisResult.categorizeProduct.unit})</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md" required />
                </div>
                <div className="flex gap-4">
                    <button type="button" onClick={handleReset} className="w-full py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md">
                        Start Over
                    </button>
                    <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-70">
                        {isSubmitting ? 'Posting...' : 'Confirm & Post Listing'}
                    </button>
                </div>
              </form>
            </div>
          )}
          
          {/* --- Universal Error/Success Messages --- */}
          {error && <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-800">{error}</div>}
          {success && <div className="mt-4 p-3 rounded-lg bg-green-100 text-green-800">{success}</div>}

        </div>
      </div>
      <div className="md:w-1/3 w-full">
        <ChatBox />
      </div>
    </div>
  );
};

export default AddListing;
