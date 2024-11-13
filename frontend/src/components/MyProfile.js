import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyProfile() {
  const [farmerData, setFarmerData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch farmer data by ID (Replace with actual farmer ID)
    const farmerId = "farmerId"; // Replace with actual farmer ID or retrieve dynamically
    axios
      .get(`http://localhost:3001/farmer/get/${farmerId}`)
      .then((response) => {
        setFarmerData(response.data.farmer);
        setUpdatedData(response.data.farmer);
      })
      .catch((error) => {
        console.error('Error fetching farmer data:', error);
      });
  }, []);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleSave = () => {
    const farmerId = "farmerId"; // Replace with actual farmer ID
    axios
      .put(`http://localhost:3001/farmer/update/${farmerId}`, updatedData)
      .then((response) => {
        setFarmerData(response.data.updatedFarmer);
        setIsEditing(false);
        setError('');
      })
      .catch((err) => {
        setError('Error updating data: ' + err.message);
        console.error('Error updating farmer data:', err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          My Profile
        </h2>

        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-gray-700">First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                className="form-input mt-1 block w-full rounded-md border-gray-300"
                value={updatedData.firstName}
                onChange={handleChange}
              />
            ) : (
              <p className="mt-2">{farmerData.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                className="form-input mt-1 block w-full rounded-md border-gray-300"
                value={updatedData.lastName}
                onChange={handleChange}
              />
            ) : (
              <p className="mt-2">{farmerData.lastName}</p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="block text-gray-700">Date of Birth</label>
            {isEditing ? (
              <input
                type="date"
                name="DOB"
                className="form-input mt-1 block w-full rounded-md border-gray-300"
                value={updatedData.DOB?.split('T')[0]}
                onChange={handleChange}
              />
            ) : (
              <p className="mt-2">{farmerData.DOB?.split('T')[0]}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700">Gender</label>
            {isEditing ? (
              <select
                name="gender"
                className="form-input mt-1 block w-full rounded-md border-gray-300"
                value={updatedData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="mt-2">{farmerData.gender}</p>
            )}
          </div>

          {/* NIC */}
          <div>
            <label className="block text-gray-700">NIC</label>
            {isEditing ? (
              <input
                type="text"
                name="NIC"
                className="form-input mt-1 block w-full rounded-md border-gray-300"
                value={updatedData.NIC}
                onChange={handleChange}
              />
            ) : (
              <p className="mt-2">{farmerData.NIC}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700">Address</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                className="form-input mt-1 block w-full rounded-md border-gray-300"
                value={updatedData.address}
                onChange={handleChange}
              />
            ) : (
              <p className="mt-2">{farmerData.address}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="block text-gray-700">Contact Number</label>
            {isEditing ? (
              <input
                type="text"
                name="contact"
                className="form-input mt-1 block w-full rounded-md border-gray-300"
                value={updatedData.contact}
                onChange={handleChange}
              />
            ) : (
              <p className="mt-2">{farmerData.contact}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                className="form-input mt-1 block w-full rounded-md border-gray-300"
                value={updatedData.email}
                onChange={handleChange}
              />
            ) : (
              <p className="mt-2">{farmerData.email}</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={handleEdit}
            className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
