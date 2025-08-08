import React, { useState, useEffect } from 'react';
import api from '../services/api';

const FarmerDashboard = () => {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setIsLoading(true);
                setError('');
                const response = await api.get('/listings/my-listings');
                setListings(response.data);
            } catch (err) {
                setError('Failed to fetch your listings. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListings();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">My Listings</h1>

                    {isLoading && <p>Loading your listings...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {!isLoading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listings.length > 0 ? (
                                listings.map((listing) => (
                                    <div key={listing._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <img src={listing.imageUrl} alt={listing.produceItem} className="w-full h-48 object-cover" />
                                        <div className="p-4">
                                            <h2 className="text-xl font-bold capitalize">{listing.produceItem}</h2>
                                            <p className="text-gray-600">{listing.quantity} {listing.unit}</p>
                                            <p className="text-lg font-semibold text-green-600 mt-2">₹{listing.price} / {listing.unit}</p>
                                            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mt-4 ${
                                                listing.status === 'available' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                                {listing.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>You have not created any listings yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FarmerDashboard;
