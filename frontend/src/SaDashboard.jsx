import React, { useState, useEffect } from 'react';
import { fetchTravelData } from './weatherEngine';
import { fetchExchangeRates } from './currencyEngine';

export default function SaDashboard() {
  const [city, setCity] = useState('Vilnius');
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  
  const [budget, setBudget] = useState(1000);
  const [baseCurrency, setBaseCurrency] = useState('EUR');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [rates, setRates] = useState({});
  const [loadingCurrency, setLoadingCurrency] = useState(false);
  const [currencyError, setCurrencyError] = useState(null);

  const currencyList = ['EUR', 'USD', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'PLN'];

  const handleSearchWeather = async (e) => {
    if (e) e.preventDefault();
    setLoadingWeather(true);
    setWeatherError(null);
    try {
      const data = await fetchTravelData(city);
      setWeather(data);
    } catch (err) {
      setWeatherError(err.message);
      setWeather(null);
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    const getRates = async () => {
      setLoadingCurrency(true);
      setCurrencyError(null);
      try {
        const liveRates = await fetchExchangeRates(baseCurrency);
        setRates(liveRates);
      } catch (err) {
        setCurrencyError(err.message);
      } finally {
        setLoadingCurrency(false);
      }
    };
    getRates();
  }, [baseCurrency]);

  useEffect(() => {
    handleSearchWeather();
  }, []);

  const conversionRate = rates[targetCurrency] || 0;
  const convertedBudget = (budget * conversionRate).toFixed(2);

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '5px' }}>Travel Companion Board (Saulius)</h2>
      <p style={{ textAlign: 'center', color: '#7f8c8d', margin: '0 0 30px 0' }}>Modular Structure (Engines Separated)</p>

      <section style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #e9ecef' }}>
        <h3 style={{ marginTop: 0, color: '#34495e' }}>Destination Forecast</h3>
        <form onSubmit={handleSearchWeather} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            style={{ padding: '10px', flex: '1', borderRadius: '6px', border: '1px solid #ced4da' }}
          />
          <button type="submit" style={{ padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Search
          </button>
        </form>

        {loadingWeather && <p style={{ color: '#3498db' }}>Fetching satellite layout...</p>}
        {weatherError && <p style={{ color: '#e74c3c', background: '#fadbd8', padding: '10px', borderRadius: '6px' }}>⚠️ {weatherError}</p>}

        {weather && !loadingWeather && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <img 
                src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`} 
                alt="weather icon" 
                style={{ background: '#ecf0f1', borderRadius: '50%' }}
              />
              <div>
                <h4 style={{ margin: 0, fontSize: '1.4rem' }}>{weather.cityName}, {weather.country}</h4>
                <p style={{ margin: '5px 0 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{weather.current.temp}°C</p>
                <p style={{ margin: 0, color: '#7f8c8d', textTransform: 'capitalize' }}>{weather.current.description} | Humidity: {weather.current.humidity}%</p>
              </div>
            </div>

            <h4 style={{ marginTop: '20px', marginBottom: '10px', color: '#2c3e50' }}>5-Day Preview</h4>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
              {weather.forecast.map((day, idx) => (
                <div key={idx} style={{ background: '#ffffff', padding: '12px 8px', borderRadius: '8px', textAlign: 'center', minWidth: '95px', flex: '1', border: '1px solid #e2e8f0' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', fontWeight: 'bold', color: '#7f8c8d' }}>
                    {day.date.split('-').slice(1).join('/')}
                  </p>
                  <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt="icon" style={{ width: '40px', height: '40px' }} />
                  <p style={{ margin: '4px 0 0 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{day.temp}°C</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#bdc3c7' }}>{day.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px solid #e9ecef' }}>
        <h3 style={{ marginTop: 0, color: '#34495e' }}>💱 Travel Budget Exchange</h3>
        
        {loadingCurrency && <p style={{ color: '#2ecc71' }}>Syncing live rates...</p>}
        {currencyError && <p style={{ color: '#e74c3c' }}>Rate Error: {currencyError}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold', color: '#7f8c8d' }}>Trip Budget Amount:</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Math.max(0, parseFloat(e.target.value) || 0))}
              style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ced4da' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold', color: '#7f8c8d' }}>From:</label>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              style={{ padding: '10px', width: '100%', borderRadius: '6px', border: '1px solid #ced4da', background: '#fff' }}
            >
              {currencyList.map((cur) => <option key={cur} value={cur}>{cur}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold', color: '#7f8c8d' }}>To:</label>
            <select
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              style={{ padding: '10px', width: '100%', borderRadius: '6px', border: '1px solid #ced4da', background: '#fff' }}
            >
              {currencyList.map((cur) => <option key={cur} value={cur}>{cur}</option>)}
            </select>
          </div>
        </div>

        <div style={{ background: '#e8f8f5', padding: '20px', borderRadius: '8px', marginTop: '20px', textAlign: 'center', border: '1px solid #d1f2eb' }}>
          <p style={{ margin: '0 0 4px 0', color: '#16a085', fontSize: '0.95rem', fontWeight: 'bold' }}>Estimated Destination Funds Available</p>
          <h2 style={{ margin: 0, color: '#117a65', fontSize: '2.2rem' }}>
            {convertedBudget} {targetCurrency}
          </h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#7f8c8d' }}>
            Live Exchange context: 1 {baseCurrency} = {conversionRate.toFixed(4)} {targetCurrency}
          </p>
        </div>
      </section>
    </div>
  );
}
