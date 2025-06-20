import React, { useState, useEffect } from 'react';
import './weather2.css';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Moscow');

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://wttr.in/${city}?format=j1`);
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
  }, [city]);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  if (loading) {
    return (
      <div className="weather-container">
        <div className="loading">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-container">
        <div className="error">Error: {error}</div>
        <button onClick={() => setCity('Moscow')} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-container">
        <div className="error">No weather data available</div>
      </div>
    );
  }

  const current = weather.current_condition[0];
  const location = weather.nearest_area[0];

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h2>Weather in {location.areaName[0].value}</h2>
        <select value={city} onChange={handleCityChange} className="city-select">
          <option value="Moscow">Moscow</option>
          <option value="Saint Petersburg">Saint Petersburg</option>
          <option value="Novosibirsk">Novosibirsk</option>
          <option value="Yekaterinburg">Yekaterinburg</option>
          <option value="Kazan">Kazan</option>
        </select>
      </div>
      
      <div className="weather-main">
        <div className="temperature">
          <span className="temp-value">{current.temp_C}°C</span>
          <span className="feels-like">Feels like {current.FeelsLikeC}°C</span>
        </div>
        
        <div className="weather-icon">
          <img src={current.weatherIconUrl[0].value} alt="weather icon" />
          <p className="weather-desc">{current.weatherDesc[0].value}</p>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Humidity:</span>
          <span className="detail-value">{current.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind:</span>
          <span className="detail-value">{current.windspeedKmph} km/h</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Pressure:</span>
          <span className="detail-value">{current.pressure} mb</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Visibility:</span>
          <span className="detail-value">{current.visibility} km</span>
        </div>
      </div>

      <div className="weather-time">
        <p>Last updated: {current.observation_time}</p>
      </div>
    </div>
  );
};

export default Weather;
