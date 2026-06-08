import React, { useState, useEffect } from 'react';
import '../index.css';

const Weather = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "afded785592a02f56aa62b6b57f085a5";

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        if (!currentRes.ok) throw new Error("City not found.");
        const currentJson = await currentRes.json();
        setWeatherData(currentJson);

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        if (!forecastRes.ok) throw new Error("Could not load forecast.");
        const forecastJson = await forecastRes.json();

        const dailyForecast = forecastJson.list.filter((_, index) => index % 8 === 0);
        setForecastData(dailyForecast);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (loading) return <p className="weather-loading">Loading weather...</p>;
  if (error) return <p className="weather-error">Error: {error}</p>;
  if (!weatherData) return <p className="weather-empty">Search a city to see weather</p>;

  return (
    <div className="weather-card">
      <h3 className="weather-title">Current weather in {weatherData.name}</h3>

      <p className="weather-temp">
        Temperature: <strong>{Math.round(weatherData.main.temp)}°C</strong>
      </p>

      <p className="weather-status">
        Status: {weatherData.weather[0].description}
      </p>

      <h4 className="weather-forecast-title">Five-day forecast</h4>

      <div className="weather-forecast">
        {forecastData.map((day, idx) => (
          <div key={idx} className="forecast-card">
            <p className="forecast-day">
              {new Date(day.dt_txt).toLocaleDateString('en-US', {
                weekday: 'short'
              })}
            </p>

            <p className="forecast-temp">
              {Math.round(day.main.temp)}°C
            </p>

            <p className="forecast-type">
              {day.weather[0].main}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;