import React, { useEffect, useState } from 'react';
import ListingCard from '../components/ListingCard';

const Dashboard = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      // Dummy data with better images
      const dummyListings = [
        {
          _id: '1',
          produce: 'Tomatoes',
          quantity: 100,
          price: 28,
          imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6895f1448a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
          farmerName: 'Suresh Patil',
          location: 'Pune',
          urgency: '1 day',
          status: 'pending',
          organic: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        },
        {
          _id: '2',
          produce: 'Onions',
          quantity: 50,
          price: 18,
          imageUrl: '',
          farmerName: 'Meena Sharma',
          location: 'Nashik',
          urgency: '2 days',
          status: 'approved',
          organic: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
        },
        {
          _id: '3',
          produce: 'Cauliflower',
          quantity: 75,
          price: 25,
          imageUrl: '',
          farmerName: 'Ravi Kumar',
          location: 'Ahmednagar',
          urgency: 'Today',
          status: 'rejected',
          organic: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
        },
        {
          _id: '4',
          produce: 'Potatoes',
          quantity: 120,
          price: 15,
          imageUrl: '',
          farmerName: 'Anjali Deshmukh',
          location: 'Satara',
          urgency: '3 days',
          status: 'pending',
          organic: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
        }
      ];

      setListings(dummyListings);
      setIsLoading(false);
      
      // Calculate stats
      setStats({
        total: dummyListings.length,
        pending: dummyListings.filter(l => l.status === 'pending').length,
        approved: dummyListings.filter(l => l.status === 'approved').length,
        rejected: dummyListings.filter(l => l.status === 'rejected').length
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredListings = filter === 'all' 
    ? listings 
    : listings.filter(listing => listing.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage farm produce listings</p>
          </div>
          
          {/* Status Filter */}
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'approved' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500">Total Listings</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
          </div>
        </div>

        {/* Listings */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No listings found</h3>
            <p className="mt-1 text-gray-500">There are currently no {filter === 'all' ? '' : filter} listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredListings.map(listing => (
              <ListingCard key={listing._id} listing={listing} isAdmin />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;