// src/services/weatherService.js
import axios from 'axios';

// Function to fetch weather data
export const fetchWeatherData = async (lat, lng) => {
  const apiKey = '123032d53f60001ec2c19c04ef19a09a'; // Replace with your weather API key
  
  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;

    // Attempt to fetch weather for the given location
    const response = await axios.get(weatherUrl);
    return response.data; // Return the fetched weather data
  } catch (error) {
    console.error("Failed to fetch weather data for the given coordinates. Fetching nearby location...");

    // Fallback to nearby location (example: nearest city or general region)
    const nearbyUrl = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lng}&cnt=1&units=metric&appid=${apiKey}`;

    try {
      const fallbackResponse = await axios.get(nearbyUrl);
      return fallbackResponse.data.list[0]; // Return the nearest location's weather data
    } catch (fallbackError) {
      console.error("Failed to fetch weather data for the nearby location.");
      return null; // If both attempts fail, return null
    }
  }
};
