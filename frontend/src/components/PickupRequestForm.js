import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeafletMap from './LeafletMap';
import { jwtDecode } from 'jwt-decode';
import WeatherCard from './WeatherCard';

const cropOptions = ['Carrot', 'Cabbage', 'Potato', 'Leek'];

const PickupRequestForm = () => {
  const [pickupData, setPickupData] = useState({
    crops: [{ cropType: '', quantity: '' }], // Array for crops and quantities
    preferredDate: '',
    preferredTime: '',
    address: '',
    location: { lat: 7.8731, lng: 80.7718 },
    NIC: '',
    weather: null,
  });

  const [weatherData, setWeatherData] = useState(null); // State for weather data
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Extract NIC from token
  useEffect(() => {
    const token = localStorage.getItem('farmerToken');
    if (token) {
      const decoded = jwtDecode(token);
      setPickupData((prevState) => ({
        ...prevState,
        NIC: decoded.nic, // Set NIC from the decoded token
      }));
    }
  }, []);

  // Handle input changes for crops array
  const handleCropChange = (index, e) => {
    const { name, value } = e.target;
    const newCrops = [...pickupData.crops];
    newCrops[index][name] = value;
    setPickupData((prevState) => ({
      ...prevState,
      crops: newCrops,
    }));
  };

  // Add a new crop input
  const addCrop = () => {
    setPickupData((prevState) => ({
      ...prevState,
      crops: [...prevState.crops, { cropType: '', quantity: '' }],
    }));
  };

  // Remove a crop input
  const removeCrop = (index) => {
    const newCrops = pickupData.crops.filter((_, i) => i !== index);
    setPickupData((prevState) => ({
      ...prevState,
      crops: newCrops,
    }));
  };
  

  // Handle other input changes (date, time, address, etc.)
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'lat' || name === 'lng') {
      setPickupData((prevState) => ({
        ...prevState,
        location: { ...prevState.location, [name]: parseFloat(value) },
      }));
    } else {
      setPickupData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
  
    // Quantity validation
    if (name === 'quantity') {
      const index = e.target.dataset.index; // Use data attribute to identify index
      if (value <= 0) {
        newErrors[`quantity${index}`] = 'Quantity must be more than 0';
      } else {
        delete newErrors[`quantity${index}`];
      }
    }
  
    // Preferred time validation
    if (name === 'preferredTime') {
      const [hours, minutes] = value.split(':').map(Number);
      if (hours < 2 || (hours >= 12 && minutes > 0)) {
        newErrors.preferredTime = 'Preferred time must be between 2:00 AM and 12:00 PM';
      } else {
        delete newErrors.preferredTime;
      }
    }
  
    // Crop type validation
    if (name === 'cropType') {
      const index = e.target.dataset.index; // Use data attribute to identify index
      const cropTypes = pickupData.crops.map(crop => crop.cropType);
  
      // Check if the crop type is empty
      if (value === '') {
        newErrors[`cropType${index}`] = 'Crop type cannot be empty';
      } 
      // Check if the crop type is already in the list (excluding current entry)
      else if (cropTypes.filter((type, i) => i !== Number(index)).includes(value)) {
        newErrors[`cropType${index}`] = 'This crop type is already added';
      } else {
        delete newErrors[`cropType${index}`];
      }
    }
  
    setErrors(newErrors);
  };
  

  // Geocode address to get latitude and longitude
  const geocodeAddress = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          pickupData.address
        )}`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setPickupData((prevState) => ({
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

  // Fetch weather based on location and preferred date
  const fetchWeather = async () => {
    setLoading(true);
    try {
      const { lat, lng } = pickupData.location;
      const formattedDate = formatDate(pickupData.preferredDate); // Extract only the date (YYYY-MM-DD)

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=123032d53f60001ec2c19c04ef19a09a`
      );

      const data = response.data;
      const forecastsForDay = data.list.filter((forecastItem) =>
        forecastItem.dt_txt.startsWith(formattedDate)
      );

      if (forecastsForDay.length > 0) {
        const closestForecast = forecastsForDay.reduce((prev, curr) => {
          const prevTimeDiff = Math.abs(
            new Date(`${formattedDate} ${pickupData.preferredTime}`).getTime() -
            new Date(prev.dt_txt).getTime()
          );
          const currTimeDiff = Math.abs(
            new Date(`${formattedDate} ${pickupData.preferredTime}`).getTime() -
            new Date(curr.dt_txt).getTime()
          );
          return currTimeDiff < prevTimeDiff ? curr : prev;
        });

        const weatherDetails = {
          temp: closestForecast.main.temp,
          feels_like: closestForecast.main.feels_like,
          wind_speed: closestForecast.wind.speed,
          humidity: closestForecast.main.humidity,
          pressure: closestForecast.main.pressure,
          description: closestForecast.weather[0].description,
          city: data.city.name,
        };
        setWeatherData(weatherDetails);
      } else {
        console.error("No forecast data available for the selected date.");
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  

  

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!pickupData.preferredDate) newErrors.preferredDate = 'Preferred date is required';
    if (!pickupData.preferredTime) newErrors.preferredTime = 'Preferred time is required';
    if (!pickupData.address) newErrors.address = 'Address is required';
    pickupData.crops.forEach((crop, index) => {
      if (!crop.cropType) newErrors[`cropType${index}`] = 'Crop type is required';
      if (!crop.quantity) newErrors[`quantity${index}`] = 'Quantity is required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      cropTypes: pickupData.crops.map((crop) => crop.cropType), // Send as an array
      quantities: pickupData.crops.map((crop) => crop.quantity), // Send as an array
      preferredDate: pickupData.preferredDate,
      preferredTime: pickupData.preferredTime,
      address: pickupData.address,
      location: { lat: pickupData.location.lat, lng: pickupData.location.lng },
      NIC: pickupData.NIC,
    };

    try {
      const token = localStorage.getItem('farmerToken');
      await axios.post('http://localhost:3001/pickup-request/add', dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Pickup request added successfully');
       // Reset the form after successful submission
    setPickupData({
      crops: [{ cropType: '', quantity: '' }],
      preferredDate: '',
      preferredTime: '',
      address: '',
      location: { lat: 7.8731, lng: 80.7718 },
      NIC: pickupData.NIC, // Keep NIC
    });
    setWeatherData(null); // Clear weather data
    setErrors({}); // Clear any validation errors
    } catch (error) {
      console.error('Error adding pickup request:', error.response ? error.response.data : error.message);
      alert(`Error adding pickup request: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto mt-0 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Pickup Request</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleSubmit} className="lg:w-1/2 space-y-4">
        {pickupData.crops.map((crop, index) => (
  <div key={index} className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">Crop Type:</label>
      <select
        name="cropType"
        data-index={index} // Set data-index for identifying the input field
        value={crop.cropType}
        onChange={(e) => handleCropChange(index, e)}
        onBlur={handleBlur} // Validate on blur
        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      >
        <option value="" disabled>Select a crop</option>
        {cropOptions.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {errors[`cropType${index}`] && (
        <p className="text-red-500 text-sm">{errors[`cropType${index}`]}</p>
      )}
    </div>
    
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">Quantity (in kg):</label>
      <input
        type="number"
        name="quantity"
        data-index={index} // Set data-index for identifying the input field
        value={crop.quantity}
        onChange={(e) => handleCropChange(index, e)}
        onBlur={handleBlur} // Validate on blur
        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      {errors[`quantity${index}`] && (
        <p className="text-red-500 text-sm">{errors[`quantity${index}`]}</p>
      )}
    </div>
    
    {index > 0 && (
      <button
        type="button"
        onClick={() => removeCrop(index)}
        className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 col-span-2"
      >
        Remove Crop
      </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addCrop}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Add Another Crop
          </button>

          {/* Other form fields for date, time, address, etc. */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Preferred Date:</label>
            <input
              type="date"
              name="preferredDate"
              value={pickupData.preferredDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              min={new Date().toISOString().split('T')[0]} // Disable past dates
              max={new Date(new Date().setDate(new Date().getDate() + 10)) // Set max date 10 days from now
                .toISOString()
                .split('T')[0]}
              required
            />
            {errors.preferredDate && (
              <p className="text-red-500 text-sm">{errors.preferredDate}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Preferred Time:</label>
            <input
              type="time"
              name="preferredTime"
              value={pickupData.preferredTime}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.preferredTime && (
              <p className="text-red-500 text-sm">{errors.preferredTime}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
            <input
              type="text"
              name="address"
              value={pickupData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
             {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>

          <button
            type="button"
            onClick={geocodeAddress}
            className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
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
                value={pickupData.location.lat}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Latitude"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Longitude:</label>
              <input
                type="number"
                name="lng"
                value={pickupData.location.lng}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Longitude"
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={fetchWeather}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Fetching Weather...' : 'Get Weather Info'}
          </button>

          <button
            type="submit"
            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Submit Pickup Request
          </button>
        </form>

        <div className="lg:w-1/2 h-96">
          <LeafletMap location={pickupData.location} />
          {weatherData && <WeatherCard weatherData={weatherData} />}
        </div>
      </div>
    </div>
  );
};

export default PickupRequestForm;
