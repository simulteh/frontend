import React, { useState, useEffect } from 'react';
import './Weather.css';

export const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://wttr.in/Moscow?format=j1');
        if (!response.ok) {
          throw new Error('Could not fetch weather data');
        }
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return <div className="weather-container">Loading weather...</div>;
  }

  if (error) {
    return <div className="weather-container">Error: {error}</div>;
  }

  return (
    <div className="weather-container">
      <h2>Weather in {weather.nearest_area[0].areaName[0].value}</h2>
      <div className="weather-info">
        <p>Current temperature: {weather.current_condition[0].temp_C}°C</p>
        <p>Feels like: {weather.current_condition[0].FeelsLikeC}°C</p>
        <p>Condition: {weather.current_condition[0].weatherDesc[0].value}</p>
        <img src={weather.current_condition[0].weatherIconUrl[0].value} alt="weather icon" />
      </div>
    </div>
  );
};