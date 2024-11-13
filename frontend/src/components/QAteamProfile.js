import React, { useState, useEffect } from 'react';

const QAteamProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3001/QATeam/me', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are sent with the request
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data.member); // Fetch member details from the response
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center my-4">{error}</p>;
  }

  if (!profile) {
    return <p className="text-gray-500 text-center my-4">Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">{profile.name}'s Profile</h2>
      <div className="space-y-4">
        <p><strong className="font-bold">NIC:</strong> {profile.NIC}</p>
        <p><strong className="font-bold">Email:</strong> {profile.contactInfo.email}</p>
        <p><strong className="font-bold">Phone:</strong> {profile.contactInfo.phone}</p>
        <p><strong className="font-bold">Birthday:</strong> {new Date(profile.birthDay).toLocaleDateString()}</p>
        <p>
          <strong className="font-bold">Address:</strong> 
          {/* Assuming address is an object with 'street' and 'city' properties */}
          {profile.address.street}, {profile.address.city}
        </p>
        <p><strong className="font-bold">Gender:</strong> {profile.gender}</p>
        <p><strong className="font-bold">Role:</strong> {profile.role}</p>
      </div>
    </div>
  );
};

export default QAteamProfile;
