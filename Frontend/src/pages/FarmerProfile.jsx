// File: client/src/pages/FarmerProfile.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';

const FarmerProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // The backend endpoint already sends all user data
                const response = await api.get('/users/profile');
                setProfileData(response.data);
            } catch (err) {
                setError('Failed to fetch profile data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Helper component for displaying profile fields cleanly
    const ProfileField = ({ label, value }) => (
        <div>
            <label className="text-sm font-medium text-gray-500">{label}</label>
            <p className="text-lg text-gray-900">{value || 'Not Provided'}</p>
        </div>
    );

    if (isLoading) {
        return <div className="text-center p-10">Loading profile...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto p-5">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
                    
                    {profileData ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Info */}
                            <ProfileField label="Full Name" value={profileData.name} />
                            <ProfileField label="Email Address" value={profileData.email} />
                            <ProfileField label="User Role" value={profileData.userType?.charAt(0).toUpperCase() + profileData.userType?.slice(1)} />
                            <ProfileField label="Phone Number" value={profileData.phone} />

                            {/* Address Info */}
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-500">Address</label>
                                <p className="text-lg text-gray-900">
                                    {profileData.address ? `${profileData.address.village}, ${profileData.address.district}, ${profileData.address.state} - ${profileData.address.pincode}` : 'Not Provided'}
                                </p>
                            </div>

                            {/* Agricultural Info */}
                            <ProfileField label="Aadhaar Number" value={profileData.aadhaar ? `**** **** ${profileData.aadhaar.slice(-4)}` : 'Not Provided'} />
                            <ProfileField label="Land Size" value={profileData.landSize ? `${profileData.landSize} acres` : 'Not Provided'} />
                            
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-500">Types of Produce Grown</label>
                                {profileData.produceTypes && profileData.produceTypes.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {profileData.produceTypes.map((produce, index) => (
                                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                                {produce}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-lg text-gray-900">Not Provided</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>No profile data found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FarmerProfile;
