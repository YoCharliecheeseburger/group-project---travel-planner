import React, { useState, useEffect } from 'react';

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
        if (!currentRes.ok) throw new Error("Miestas nerastas");
        const currentJson = await currentRes.json();
        setWeatherData(currentJson);

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        if (!forecastRes.ok) throw new Error("Nepavyko užkrauti prognozės");
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

  if (loading) return <p>Laukiama oro salygų duomenys...</p>;
  if (error) return <p style={{ color: 'red' }}>Klaida: {error}</p>;
  if (!weatherData) return <p>Įveskite kelionės tikslą, kad pamatytumėte savo orus.</p>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', margin: '10px 0' }}>
      <h3>Esami orai: {weatherData.name}</h3>
      <p>Temperatūra: **{Math.round(weatherData.main.temp)}°C**</p>
      <p>Būsena: {weatherData.weather[0].description}</p>

      <h4>Penkių dienų prognozė:</h4>
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
        {forecastData.map((day, idx) => (
          <div key={idx} style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
            <p><strong>{new Date(day.dt_txt).toLocaleDateString('lt-LT', { weekday: 'short' })}</strong></p>
            <p>{Math.round(day.main.temp)}°C</p>
            <p style={{ fontSize: '12px' }}>{day.weather[0].main}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;