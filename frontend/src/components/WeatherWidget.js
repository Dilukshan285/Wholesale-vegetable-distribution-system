import React, { useEffect, useState } from 'react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch weather based on latitude and longitude
    const fetchWeather = (latitude, longitude) => {
      const apiKey = '123032d53f60001ec2c19c04ef19a09a'; // Replace with your OpenWeatherMap API key
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
        .then((res) => res.json())
        .then((data) => {
          setWeather(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch weather data');
          setLoading(false);
        });
    };

    // Get user's location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          setError('Unable to retrieve location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  return (
    <div className="bg-gray-800 text-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center h-full">
  <h3 className="text-2xl font-semibold mb-4">Current Weather</h3>
  {loading ? (
    <p>Loading...</p>
  ) : error ? (
    <p>{error}</p>
  ) : weather ? (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="text-2xl font-bold">{weather.name}</p>
      <div className="flex items-center">
        {/* Weather Icon */}
        <img 
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
          alt={weather.weather[0].description} 
          className="w-12 h-12"
        />
        <p className="capitalize ml-2">{weather.weather[0].description}</p>
      </div>
      <p className="text-4xl font-bold">
        {(weather.main.temp - 273.15).toFixed(1)} °C
      </p>
      <div className="mt-2 text-sm text-center">
        <p>Feels like: {(weather.main.feels_like - 273.15).toFixed(1)} °C</p>
        <p>Humidity: {weather.main.humidity}%</p>
        <p>Wind Speed: {weather.wind.speed} m/s</p>
      </div>
    </div>
  ) : (
    <p>Unable to load weather data</p>
  )}
</div>

  );
};

export default WeatherWidget;
