import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext';

// --- ListingCard Component ---
const ListingCard = ({ listing }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(listing, parseInt(quantity));
        alert(`${quantity} ${listing.unit} of ${listing.produceItem} added to cart!`);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <img src={listing.imageUrl} alt={listing.produceItem} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-bold capitalize">{listing.produceItem}</h2>
                <p className="text-sm text-gray-500">from {listing.farmer.name}</p>
                <p className="text-gray-700 mt-2 text-sm italic">"{listing.aiQualityAssessment}"</p>
                <p className="text-gray-600 mt-2 text-sm bg-gray-50 p-2 rounded-md">"{listing.aiGeneratedAd}"</p>
                <div className="mt-auto pt-4">
                    <p className="text-lg font-semibold text-green-600">₹{listing.price} / {listing.unit}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <input 
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="1"
                            max={listing.quantity} // Can't order more than available
                            className="w-20 p-2 border border-gray-300 rounded-md"
                        />
                        <span className="text-gray-600">{listing.unit}</span>
                    </div>
                    <button onClick={handleAddToCart} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- BuyerDashboard Page ---
const BuyerDashboard = () => {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNearbyListings = async () => {
            try {
                const response = await api.get('/listings/nearby');
                console.log(response);
                setListings(response.data);
            } catch (err) {
                setError('Failed to fetch nearby listings.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchNearbyListings();
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-6">Fresh Produce Near You</h1>
            {isLoading && <p>Loading listings...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map(listing => (
                    <ListingCard key={listing._id} listing={listing} />
                ))}
            </div>
        </div>
    );
};

export default BuyerDashboard;