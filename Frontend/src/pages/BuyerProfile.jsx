// File: client/src/pages/BuyerProfile.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';

const BuyerProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Uses the same endpoint as the farmer profile
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

    const ProfileField = ({ label, value }) => (
        <div>
            <label className="text-sm font-medium text-gray-500">{label}</label>
            <p className="text-lg text-gray-900">{value || 'Not Provided'}</p>
        </div>
    );

    if (isLoading) return <div className="text-center p-10">Loading profile...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto p-5">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
                    {profileData && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <ProfileField label="Full Name / Business Name" value={profileData.name} />
                            <ProfileField label="Email Address" value={profileData.email} />
                            <ProfileField label="User Role" value={profileData.userType?.charAt(0).toUpperCase() + profileData.userType?.slice(1)} />
                            <ProfileField label="Contact Phone" value={profileData.phone} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyerProfile;
