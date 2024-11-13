import React, { useEffect, useState } from 'react';
import WeatherWidget from './WeatherWidget';
import CalendarWidget from './CalendarWidget';
import StatsCard from './StatsCard';
import CropReadinessChart from './CropReadinessChart'; 
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import PickupRequestListCount from './PickupRequestListCount';

const FarmerDashboard = () => {
  const [pickupRequestCount, setPickupRequestCount] = useState(0);
  const [cropReadinessCount, setCropReadinessCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({ Pending: 0, InProgress: 0, Completed: 0 });
  const [notifications, setNotifications] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const token = localStorage.getItem('farmerToken');
  let farmerNIC = '';

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      farmerNIC = decodedToken.nic; 
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      if (farmerNIC) {
        try {
          const response = await axios.get('http://localhost:3001/cropReadiness/notifications', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setNotifications(response.data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };
    fetchNotifications();
  }, [farmerNIC, token]);

  useEffect(() => {
    setCropReadinessCount(notifications.length);
    const statusCounts = notifications.reduce((acc, readiness) => {
      acc[readiness.status] = (acc[readiness.status] || 0) + 1;
      return acc;
    }, { Pending: 0, InProgress: 0, Completed: 0 });
    setStatusCounts(statusCounts);
  }, [notifications]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=123032d53f60001ec2c19c04ef19a09a&q=YOUR_LOCATION`);
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Dashboard Header */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Farmer Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <StatsCard title="Total Pickup Requests" value={pickupRequestCount} />
        <PickupRequestListCount setTotalRequests={setPickupRequestCount} />
        <StatsCard title="Crop Readiness Notifications" value={cropReadinessCount} />
        
      </div>

      {/* Weather and Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <WeatherWidget weatherData={weatherData} />
        <CalendarWidget />
      </div>

      {/* Bar and Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <CropReadinessChart statusCounts={statusCounts} />
        <div className="my-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Crop Readiness Notifications</h2>
        <ul className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <li key={notification._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <p className="font-medium text-gray-800">{notification.cropVariety}</p>
                <p className="text-gray-600">Quantity: {notification.quantity}</p>
                <p className="text-gray-600">Preferred Pickup Date: {new Date(notification.preferredPickupDate).toLocaleDateString()}</p>
                <p className="text-gray-600">Status: {notification.status}</p>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No notifications available.</p>
          )}
        </ul>
      </div>
      </div>

      {/* Notifications Section */}
      
    </div>
  );
};

export default FarmerDashboard;
