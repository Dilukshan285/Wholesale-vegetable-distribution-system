import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeafletMap from './LeafletMap';
import { jwtDecode } from 'jwt-decode';
import { FaPlus } from 'react-icons/fa'; // Importing an icon from React Icons

const AddLand = () => {
  const [landData, setLandData] = useState({
    landSize: '',
    soilType: '',
    cropsGrown: [],
    location: { lat: 7.8731, lng: 80.7718 },
    address: '',
    farmerId: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedCrop, setSelectedCrop] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("farmerToken");
    if (token) {
      const decoded = jwtDecode(token);
      setLandData((prevState) => ({
        ...prevState,
        farmerId: decoded.farmerId
      }));
    }
  }, []);

  const validateField = (name, value) => {
    const newErrors = {};
    switch (name) {
      case 'landSize':
        if (!value) {
          newErrors.landSize = "Land size is required.";
        } else if (!/^[0-9.,]+$/.test(value)) {
          newErrors.landSize = "Land size must be a number, comma, or period.";
        }
        break;

      case 'soilType':
        if (!value) {
          newErrors.soilType = "Soil type is required.";
        }
        break;

      case 'address':
        if (!value) {
          newErrors.address = "Address is required.";
        }
        break;
        case 'cropsGrown':
      if (landData.cropsGrown.length === 0) {
        newErrors.cropsGrown = "At least one crop must be selected.";
      }
      break;

      case 'lat':
      case 'lng':
        if (!landData.location.lat || !landData.location.lng) {
          newErrors.location = "Location coordinates are required.";
        }
        break;

      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors
    }));
  };
  

  const validateFields = () => {
    const newErrors = {};

    // Validate landSize for correct format
    if (!landData.landSize) {
      newErrors.landSize = "Land size is required.";
    } else if (!/^[0-9.,]+$/.test(landData.landSize)) {
      newErrors.landSize = "Land size must be a number, comma, or period.";
    }

    // Validate soilType
    if (!landData.soilType) {
      newErrors.soilType = "Soil type is required.";
    }

    // Validate cropsGrown
    if (landData.cropsGrown.length === 0) {
      newErrors.cropsGrown = "At least one crop must be selected.";
    }

    // Validate address
    if (!landData.address) {
      newErrors.address = "Address is required.";
    }

    // Validate location
    if (!landData.location.lat || !landData.location.lng) {
      newErrors.location = "Location coordinates are required.";
    }

    setErrors(newErrors);
    return newErrors; // Return the new errors for further checks
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle landSize input and restrict invalid characters
    if (name === 'landSize') {
      const validValue = value.replace(/[^1-9.,]/g, '');
      setLandData((prevState) => ({
        ...prevState,
        [name]: validValue,
      }));
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
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
  
    if (name === 'cropsGrown') {
      validateField(name, landData.cropsGrown);
    } else {
      validateField(name, value); // Call the existing validation for other fields
    }
  };
  
  

  const geocodeAddress = async () => {
    setLoading(true);
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
      console.error('Error geocoding address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();

    // Check if there are any errors
    if (Object.keys(validationErrors).length > 0) {
      alert('Please fix the errors before submitting.');
      return;
    }

    const token = localStorage.getItem("farmerToken");
    
    const dataToSend = {
      landSize: landData.landSize,
      soilType: landData.soilType,
      cropsGrown: landData.cropsGrown,
      address: landData.address,
      location: {
        lat: landData.location.lat,
        lng: landData.location.lng,
      },
    };

    console.log("Land Data before sending:", dataToSend);

    try {
      const response = await axios.post('http://localhost:3001/land/add', dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Land added successfully');
      // Optionally reset the form or redirect
      setLandData({
        landSize: '',
        soilType: '',
        cropsGrown: [],
        location: { lat: 7.8731, lng: 80.7718 },
        address: '',
        farmerId: landData.farmerId
      });
      setSelectedCrop('');
      setErrors({});
    } catch (error) {
      console.error('Error adding land:', error.response ? error.response.data : error.message);
      alert('Error adding land: ' + (error.response ? error.response.data.error : 'Unknown error'));
    }
  };

  const handleAddCrop = () => {
    if (selectedCrop && !landData.cropsGrown.includes(selectedCrop)) {
      setLandData((prevState) => ({
        ...prevState,
        cropsGrown: [...prevState.cropsGrown, selectedCrop],
      }));
      setSelectedCrop('');
      setErrors((prevErrors) => ({ ...prevErrors, cropsGrown: null })); // Clear crop error
    }
  };
  

  const handleRemoveCrop = (crop) => {
    setLandData((prevState) => ({
      ...prevState,
      cropsGrown: prevState.cropsGrown.filter(c => c !== crop),
    }));
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Land</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleSubmit} className="lg:w-1/2 space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Land Size (in acres):</label>
            <input
              type="text" 
              name="landSize"
              value={landData.landSize}
              onChange={handleChange}
              onBlur={handleBlur}
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
              onBlur={handleBlur}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.soilType && <span className="text-red-500 text-sm">{errors.soilType}</span>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Crops Grown:</label>
            <div className="flex items-center space-x-2">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                onBlur={(e) => validateField('cropsGrown', landData.cropsGrown)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select a crop</option>
                <option value="Carrot">Carrot</option>
                <option value="Leek">Leek</option>
                <option value="Cabbage">Cabbage</option>
                <option value="Potato">Potato</option>
              </select>
              <button
                type="button"
                onClick={handleAddCrop}
                onBlur={handleBlur}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                title="Add Crop"
              >
                <FaPlus />
              </button>
            </div>
            {errors.cropsGrown && <span className="text-red-500 text-sm">{errors.cropsGrown}</span>}
            <div className="mt-2">
              <span className="text-gray-700">Selected Crops:</span>
              <ul>
                {landData.cropsGrown.map((crop, index) => (
                  <li key={index} className="flex items-center justify-between">
                    {crop}
                    <button
                      type="button"
                      onClick={() => handleRemoveCrop(crop)}
                      className="text-red-500 ml-2"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
            <input
              type="text"
              name="address"
              value={landData.address}
              onChange={handleChange}
              onBlur={handleBlur}
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
                value={landData.location.lat}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Longitude:</label>
              <input
                type="number"
                name="lng"
                value={landData.location.lng}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>
          {errors.location && <span className="text-red-500 text-sm">{errors.location}</span>}

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </form>

        {/* Map Component to show location */}
        <div className="lg:w-1/2">
          <LeafletMap location={landData.location} />
        </div>
      </div>
    </div>
  );
};

export default AddLand;
