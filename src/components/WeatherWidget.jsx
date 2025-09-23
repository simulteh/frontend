import React, { useEffect, useState } from 'react';
const API_KEY = '7623e69e0811585509d2199ae84f6bd5';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается браузером');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ru&appid=${API_KEY}`
          );
          const data = await response.json();
          if (data.cod === 200) {
            setWeather({
              temp: Math.round(data.main.temp),
              description: data.weather[0].description,
              city: data.name,
              icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            });
          } else {
            setError(data.message);
          }
        } catch (err) {
          setError('Ошибка при получении погоды');
        }
      },
      () => setError('Не удалось определить местоположение')
    );
  }, []);

  if (error) return <p className="weather-error">{error}</p>;
  if (!weather) return <p className="weather-loading">Загрузка погоды...</p>;

  return (
    <div className="weather-widget">
      <img src={weather.icon} alt={weather.description} className="weather-icon" />
      <div className="weather-info">
        <p className="weather-city">{weather.city}</p>
        <p className="weather-temp">{weather.temp}°C</p>
        <p className="weather-desc">{weather.description}</p>
      </div>
    </div>
  );
};

export default WeatherWidget;
