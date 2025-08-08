// components/ListingCard.jsx
import React from 'react';

const ListingCard = ({ listing, onApprove, onReject }) => {
  const {
    produce,
    quantity,
    price,
    imageUrl,
    farmerName,
    location,
    urgency,
    status,
  } = listing;

  // Determine urgency color
  const urgencyColor = urgency === 'high' ? 'text-red-500' : 
                     urgency === 'medium' ? 'text-yellow-500' : 
                     'text-green-500';

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image section */}
        <div className="flex-shrink-0">
          <img
            src={imageUrl}
            alt={produce}
            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
          />
        </div>
        
        {/* Main content */}
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            {/* Listing info */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-gray-800 capitalize">{produce}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === 'approved' ? 'bg-green-100 text-green-800' : status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span className="text-gray-600">{quantity} kg</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">₹{price}/kg</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-600">{farmerName}</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">{location}</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="flex items-center">
                    Urgency: 
                    <span className={`ml-1 font-medium ${urgencyColor}`}>
                      {urgency}
                      {urgency === 'high' && (
                        <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
                onClick={onApprove}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
                onClick={onReject}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;