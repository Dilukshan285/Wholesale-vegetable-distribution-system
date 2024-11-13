import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash } from 'react-icons/fa'; // Plus and Trash icons for add/remove
import LeafletMap from './LeafletMap';
import { useParams, useNavigate } from "react-router-dom";

const UpdateLand = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [landData, setLandData] = useState({
    landSize: '',
    soilType: '',
    cropsGrown: [],
    location: { lat: 7.8731, lng: 80.7718 }, // Default coordinates
    address: ''
  });

  const [cropInput, setCropInput] = useState('');
  const [cropOptions, setCropOptions] = useState([]); // List of crops for dropdown
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLandDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/land/get/${id}`);
        const land = response.data;

        if (land && land.coordinates) {
          setLandData({
            landSize: land.landSize,
            soilType: land.soilType,
            cropsGrown: land.cropsGrown || [],
            location: {
              lat: land.coordinates.lat,
              lng: land.coordinates.lng,
            },
            address: land.address,
          });
        } else {
          throw new Error("Coordinates not found.");
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch land details.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch crop options (mock or API call)
    const fetchCropOptions = async () => {
      try {
        const cropData = await axios.get("http://localhost:3001/crops"); // Mock or real endpoint for available crops
        setCropOptions(cropData.data);
      } catch (err) {
        console.error("Failed to fetch crop options:", err);
        setCropOptions([]); // Default to empty if there’s an error
      }
    };

    fetchLandDetails();
    fetchCropOptions();
  }, [id]);

  // Real-time validation function
  const validateFields = () => {
    const newErrors = {};

    if (!landData.landSize) {
      newErrors.landSize = "Land size is required.";
    } else if (!/^[0-9.,]+$/.test(landData.landSize)) {
      newErrors.landSize = "Land size must be a number, comma, or period.";
    }

    if (!landData.soilType) {
      newErrors.soilType = "Soil type is required.";
    }

    if (landData.cropsGrown.length === 0) {
      newErrors.cropsGrown = "At least one crop must be added.";
    }

    if (!landData.address) {
      newErrors.address = "Address is required.";
    }

    if (!landData.location.lat || !landData.location.lng) {
      newErrors.location = "Location coordinates are required.";
    }

    setErrors(newErrors);
    return newErrors;
  };

  // Update landData for input changes and validate in real-time
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'landSize') {
      // Allow only numbers, periods, and commas in land size
      if (/^[0-9.,]*$/.test(value)) {
        setLandData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else if (name === 'lat' || name === 'lng') {
      setLandData((prevState) => ({
        ...prevState,
        location: {
          ...prevState.location,
          [name]: parseFloat(value),
        },
      }));
    } else {
      setLandData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    // Validate fields on input change
    validateFields();
  };

  // Add crop to the list
  const handleAddCrop = () => {
    if (cropInput.trim() !== '' && !landData.cropsGrown.includes(cropInput.trim())) {
      setLandData((prevState) => ({
        ...prevState,
        cropsGrown: [...prevState.cropsGrown, cropInput.trim()],
      }));
      setCropInput(''); // Clear dropdown after selection
      setErrors((prevState) => ({ ...prevState, cropsGrown: null })); // Clear error for crops
    } else {
      setErrors((prevState) => ({
        ...prevState,
        cropsGrown: "Crop must be selected and not already in the list.",
      }));
    }
  };

  // Remove crop from the list
  const handleRemoveCrop = (cropToRemove) => {
    setLandData((prevState) => ({
      ...prevState,
      cropsGrown: prevState.cropsGrown.filter(crop => crop !== cropToRemove),
    }));
  };

  const geocodeAddress = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(landData.address)}`
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setLandData((prevState) => ({
          ...prevState,
          location: { lat: parseFloat(lat), lng: parseFloat(lon) },
        }));
      } else {
        alert('Address not found.');
      }
    } catch (error) {
      setError('Error geocoding address: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      alert('Please fix the errors before submitting.');
      return;
    }

    const token = localStorage.getItem("farmerToken");
    try {
      await axios.put(`http://localhost:3001/land/update/${id}`, landData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Land updated successfully');
      navigate(`/fm_layout/land-details/${id}`);
    } catch (error) {
      console.error('Error updating land:', error);
      alert('Error updating land: ' + error.response?.data.message || 'Unknown error');
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Land</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleSubmit} className="lg:w-1/2 space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Land Size (in acres):</label>
            <input
              type="text"
              name="landSize"
              value={landData.landSize}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.landSize && <span className="text-red-500 text-sm">{errors.landSize}</span>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Soil Type:</label>
            <input
              type="text"
              name="soilType"
              value={landData.soilType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.soilType && <span className="text-red-500 text-sm">{errors.soilType}</span>}
          </div>

          {/* Crops Dropdown Section */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Crops Grown:</label>
            <div className="flex space-x-2">
              <select
                value={cropInput}
                onChange={(e) => setCropInput(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select a crop</option>
                <option value="Carrot">Carrot</option>
                <option value="Leek">Leek</option>
                <option value="Cabbage">Cabbage</option>
                <option value="Potato">Potato</option>
                {cropOptions.map((crop, index) => (
                  <option key={index} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddCrop}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
              >
                <FaPlus />
              </button>
            </div>
            {errors.cropsGrown && <span className="text-red-500 text-sm">{errors.cropsGrown}</span>}
          </div>

          {/* Display Added Crops */}
          {landData.cropsGrown.length > 0 && (
            <div className="mt-4">
              <h3 className="text-gray-700 text-sm font-bold">Added Crops:</h3>
              <ul>
                {landData.cropsGrown.map((crop, index) => (
                  <li key={index} className="flex justify-between items-center">
                    {crop}
                    <button
                      type="button"
                      onClick={() => handleRemoveCrop(crop)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
            <input
              type="text"
              name="address"
              value={landData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
          </div>

          <button
            type="button"
            onClick={geocodeAddress}
            className={`w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
            disabled={loading}
          >
            {loading ? 'Locating...' : 'Locate on Map'}
          </button>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Latitude:</label>
              <input
                type="number"
                name="lat"
                value={landData.location.lat || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Longitude:</label>
              <input
                type="number"
                name="lng"
                value={landData.location.lng || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>
          {errors.location && <span className="text-red-500 text-sm">{errors.location}</span>}


          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Update Land
          </button>
        </form>

        <div className="lg:w-1/2">
          <h2 className="text-xl font-bold mb-4">Land Location:</h2>
          <LeafletMap location={landData.location} />
        </div>
      </div>
    </div>
  );
};

export default UpdateLand;
