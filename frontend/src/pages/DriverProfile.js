import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DriverProfile = () => {
  const [driver, setDriver] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3001/driver/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDriver(response.data); // Assuming the response contains driver's details
      } catch (error) {
        // Handle error and log details
        console.error('Error fetching driver details', error.response ? error.response.data : error.message);
      }
    };

    fetchDriverDetails();
  }, [token]);

  if (!driver) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{driver.name}'s Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Personal Information</h2>
          <p className="mt-2"><strong>Email:</strong> {driver.email}</p>
          <p className="mt-2"><strong>Phone:</strong> +{driver.mobileNo}</p>
          <p className="mt-2"><strong>NIC:</strong> {driver.nic}</p>
          <p className="mt-2"><strong>Date of Birth:</strong> {driver.dob}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700">License Information</h2>
          <p className="mt-2"><strong>License Number:</strong> {driver.licenseNo}</p>
          <p className="mt-2"><strong>License Expiration Date:</strong> {new Date(driver.licenseExpDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-700">Security</h2>
        <p className="mt-2"><strong>Password:</strong> ******** (hidden for security)</p>
      </div>
    </div>
  );
};

export default DriverProfile;
