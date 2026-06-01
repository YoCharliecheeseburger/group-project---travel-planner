
import React, { useState } from 'react';
import Weather from './components/Weather';
import CurrencyConverter from './components/CurrencyConverter';

function App() {
  const [searchCity, setSearchCity] = useState('');
  const [activeCity, setActiveCity] = useState('');
  const [tripBudget, setTripBudget] = useState(500);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveCity(searchCity);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Grupės kelionių planuoklis</h1>
      
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Įveskite miestą (pvz., Vilnius, Paryžius)..." 
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #aaa' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Ieškoti</button>
      </form>

      <div style={{ marginBottom: '20px' }}>
        <label>Nustatyti kelionės biudžetą (USD): </label>
        <input 
          type="number" 
          value={tripBudget} 
          onChange={(e) => setTripBudget(Number(e.target.value))} 
          style={{ width: '100px', padding: '5px', marginLeft: '10px' }}
        />
      </div>

      <hr />

      {activeCity && (
        <div>
          <h2>Kelionės informacija: {activeCity}</h2>
          <Weather city={activeCity} />
          <CurrencyConverter baseBudget={tripBudget} />
        </div>
      )}
    </div>
  );
}

export default App;
export default App;