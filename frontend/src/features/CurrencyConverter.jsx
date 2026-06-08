import React, { useState, useEffect } from 'react';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    try {
      return JSON.parse(decodeURIComponent(parts.pop().split(';').shift()));
    } catch {
      return null;
    }
  }
  return null;
};

const setCookie = (name, value) => {
  document.cookie = `${name}=${encodeURIComponent(
    JSON.stringify(value)
  )}; path=/; max-age=${60 * 60 * 24 * 30}`;
};

const CurrencyConverter = ({ baseBudget }) => {
  const [rates, setRates] = useState({});
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [convertedBudget, setConvertedBudget] = useState(0);

  const COOKIE_KEY = "trip_currency";
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const saved = getCookie(COOKIE_KEY);
    if (saved) setTargetCurrency(saved);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    setCookie(COOKIE_KEY, targetCurrency);
  }, [targetCurrency, initialized]);

  useEffect(() => {
    fetch('https://api.frankfurter.dev/v1/latest?base=EUR')
      .then((res) => res.json())
      .then((data) => {
        setRates(data.rates);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!baseBudget) return;

    if (targetCurrency === 'EUR') {
      setConvertedBudget(baseBudget);
    } else if (rates[targetCurrency]) {
      const result = baseBudget * rates[targetCurrency];
      setConvertedBudget(result.toFixed(2));
    }
  }, [baseBudget, targetCurrency, rates]);

  return (
    <div
    className='currencyConv'
      style={{
        padding: '15px',
        borderRadius: '8px',
        margin: '10px 0',
      }}
    >
      <h3>Currency Converter (Base: EUR)</h3>

      <div style={{ marginBottom: '10px' }}>
        <label>Select target currency: </label>

        <select
          value={targetCurrency}
          onChange={(e) => setTargetCurrency(e.target.value)}
        >
          <option value="EUR">EUR (€)</option>
          <option value="USD">USD ($)</option>
          <option value="GBP">GBP (£)</option>
          <option value="JPY">JPY (¥)</option>
          <option value="AUD">AUD ($)</option>
          <option value="CAD">CAD ($)</option>
        </select>
      </div>

      <p>
        Original Budget: <strong>{baseBudget} EUR</strong>
      </p>

      <p>
        Converted Budget:{' '}
        <span style={{ color: 'green', fontSize: '18px', fontWeight: 'bold' }}>
          {convertedBudget} {targetCurrency}
        </span>
      </p>
    </div>
  );
};

export default CurrencyConverter;