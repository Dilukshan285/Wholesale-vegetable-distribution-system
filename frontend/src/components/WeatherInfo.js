// WeatherInfo.js
import React from 'react';

// Mapping of weather conditions to corresponding images
const weatherIcons = {
  Clear: 'https://cdn-icons-png.flaticon.com/128/2698/2698194.png', // Replace with actual URLs for icons
  Rain: 'https://cdn-icons-png.flaticon.com/128/8841/8841317.png',
  Drizzle: 'https://cdn-icons-png.flaticon.com/128/5113/5113614.png',
  Thunderstorm: 'https://cdn-icons-png.flaticon.com/128/1959/1959334.png',
  Snow: 'https://cdn-icons-png.flaticon.com/128/2942/2942909.png',
  Clouds: 'https://cdn-icons-png.flaticon.com/128/414/414927.png',
};

const WeatherInfo = ({ weatherData }) => {
  // Extract main weather condition and corresponding icon
  const mainCondition = weatherData.weather[0].main;
  const iconUrl = weatherIcons[mainCondition] || 'https://cdn-icons-png.flaticon.com/128/4643/4643191.png'; // Default icon if condition not found

  return (
    <div className="mt-6 p-4 bg-blue-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Weather Forecast</h2>
      <div className="flex items-center space-x-4">
        <img
          src={iconUrl}
          alt={mainCondition}
          className="w-16 h-16" // Adjust size as needed
        />
        <div>
          <h3 className="text-lg font-semibold">Current Weather</h3>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Condition: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity} %</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;
