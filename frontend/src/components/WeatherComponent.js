// src/components/WeatherComponent.js
import React, { useState, useEffect } from 'react';
import { fetchWeatherData } from '../services/weatherService'; // Import the weather service
import WeatherCard from './WeatherCard'; // Assuming you have a WeatherCard component

const WeatherComponent = ({ location }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (location?.lat && location?.lng) {
        const data = await fetchWeatherData(location.lat, location.lng); // Use the service to fetch data
        if (data) {
          setWeatherData(data);
        } else {
          setError("Unable to fetch weather data for this location or nearby.");
        }
      }
    };

    fetchData();
  }, [location]);

  if (error) {
    return <div>{error}</div>;
  }

  return weatherData ? <WeatherCard weatherData={weatherData} /> : <div>Loading...</div>;
};

export default WeatherComponent;
