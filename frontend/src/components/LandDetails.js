import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; // Import magnifying glass icon

const LandDetails = () => {
  const [landDetails, setLandDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false); // State to toggle search bar visibility
  const [searchAddress, setSearchAddress] = useState(''); // State to store address search input
  const [cropFilter, setCropFilter] = useState(''); // State to store selected crop filter
  const navigate = useNavigate();

  // Fetch land details on component mount
  useEffect(() => {
    const fetchLandDetails = async () => {
      try {
        const token = localStorage.getItem('farmerToken');
        const response = await axios.get('http://localhost:3001/land/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLandDetails(response.data);
      } catch (error) {
        console.error('Error fetching land details:', error);
        setError('Error fetching land details: ' + (error.response?.data.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchLandDetails();
  }, []);

  // Handle delete land by ID
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this land?")) {
      try {
        await axios.delete(`http://localhost:3001/land/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('farmerToken')}`,
          },
        });
        setLandDetails(prevLands => prevLands.filter((land) => land._id !== id));
      } catch (error) {
        setError('Error deleting land: ' + (error.response?.data.message || error.message));
      }
    }
  };

  // Redirect to update page
  const handleUpdate = (id) => {
    navigate(`/fm_layout/update-land/${id}`);
  };

  // Toggle the search bar visibility
  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  // Filter land details based on search and crop filter
const filteredLandDetails = landDetails.filter((land) => {
  const addressMatch = land.address.toLowerCase().includes(searchAddress.toLowerCase());
  const cropMatch = cropFilter ? 
    land.cropsGrown.some(crop => crop.toLowerCase() === cropFilter.toLowerCase()) : true;
  return addressMatch && cropMatch;
});


  if (loading) return <div className="text-center text-lg text-gray-700">Loading land details...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Land Details</h1>
        
        {/* Magnifying Glass Icon for Search */}
        <button onClick={toggleSearchBar} className="text-gray-700 hover:text-gray-900">
          <FaSearch size={24} />
        </button>
      </div>

      {/* Search Bar */}
      {showSearchBar && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by address"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}

      {/* Crop Filter Dropdown */}
      <div className="mb-4">
        <label className="text-gray-700 font-semibold">Filter by Crop:</label>
        <select
          value={cropFilter}
          onChange={(e) => setCropFilter(e.target.value)}
          className="ml-2 px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All</option>
          <option value="Carrot">Carrot</option>
          <option value="Cabbage">Cabbage</option>
          <option value="Potato">Potato</option>
          <option value="Leek">Leek</option>
        </select>
      </div>

      {filteredLandDetails.length === 0 ? (
        <div className="text-center text-gray-600">No land details available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-700 text-white text-sm uppercase leading-normal">
                <th className="py-3 px-6 text-left">Land Size (acres)</th>
                <th className="py-3 px-6 text-left">Address</th>
                <th className="py-3 px-6 text-left">Latitude</th>
                <th className="py-3 px-6 text-left">Longitude</th>
                <th className="py-3 px-6 text-left">Soil Type</th>
                <th className="py-3 px-6 text-left">Crops Grown</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filteredLandDetails.map((land) => (
                <tr key={land._id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-200">
                  <td className="py-3 px-6 text-left">{land.landSize}</td>
                  <td className="py-3 px-6 text-left">{land.address}</td>
                  <td className="py-3 px-6 text-left">{land.coordinates.lat}</td>
                  <td className="py-3 px-6 text-left">{land.coordinates.lng}</td>
                  <td className="py-3 px-6 text-left">{land.soilType}</td>
                  <td className="py-3 px-6 text-left">{land.cropsGrown.join(', ')}</td>
                  <td className="py-3 px-6 text-left">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdate(land._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(land._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LandDetails;
