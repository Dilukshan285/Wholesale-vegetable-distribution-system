import React from 'react';

const WeatherCard = ({ weatherData }) => {
  const { temp, feels_like, wind_speed, humidity, pressure, description, city } = weatherData;

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full mt-6">
      <div className="text-lg font-bold mb-2">{city}</div>
      <div className="text-sm capitalize">{description}</div>
      <div className="flex items-center justify-between mt-4">
        <div className="text-6xl font-bold">{Math.round(temp)}°C</div>
        <div className="text-sm text-right">
          <div>Feels like: {Math.round(feels_like)}°C</div>
          <div>Wind: {wind_speed} m/s</div>
          <div>Humidity: {humidity}%</div>
          <div>Pressure: {pressure} hPa</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
