import React, { useState, useEffect } from 'react'
import '../index.css'
import Map from '../features/map.jsx'
import Weather from '../features/weather.jsx'
import TripBudgetCalculator from '../features/TripBudgetCalculator.jsx'
import CurrencyConverter from '../features/CurrencyConverter.jsx'

function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [popularCities, setPopularCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [SavedTrips, setSavedTrips] = useState([]);
  const [budget, setBudget] = useState(1500);
  const [savedAttractions, setSavedAttractions] = useState([]);

  useEffect(() => {
    if (searchInput.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${searchInput}&addressdetails=1&limit=8`,
          {
            headers: {
              "Accept": "application/json",
            },
          }
        );
        
        const data = await res.json();

        const results = data.map((item) => ({
          name: item.display_name.split(",")[0],
          countryName: item.address?.country,
          lat: item.lat,
          lon: item.lon,
          type: item.type,
        }));

        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  const fetchPopularCities = async (countryName, countryCode) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${countryName}&limit=20&appid=afded785592a02f56aa62b6b57f085a5`
      );
      const data = await response.ok ? await response.json() : [];

      if (data.length > 0) {
        const cities = data.map(city => city.name);
        const uniqueCities = [...new Set(cities)].slice(0, 10);
        setPopularCities(uniqueCities);
      } else {
        setPopularCities([]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setPopularCities([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    if (suggestion.type === 'country') {
      setSelectedCountry(suggestion.name);
      setSelectedCity(null);
      fetchPopularCities(suggestion.name, suggestion.countryCode);
      setSearchInput('');
      setShowSuggestions(false);
    } else {
      setSelectedCity(suggestion.name);
      setSelectedCountry(suggestion.countryName);
      setSearchInput('');
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setSearchInput('');
    setShowSuggestions(false);
  };

  const handleSaveTrip = async () => {
    if (!selectedCity || !selectedCountry) return;

    await fetch("http://localhost:3000/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${selectedCity}, ${selectedCountry}`,
        source: selectedCountry,
        destination: selectedCity,

        budget,
        attractions: savedAttractions,
        restaurants: []
      }),
    });

    setSelectedCity(null);
    setSelectedCountry(null);
    setPopularCities([]);
  };

  const handleClearTrip = () => {
    setSelectedCity(null);
    setSelectedCountry(null);
    setPopularCities([]);
    setSearchInput('');
  };

  return (
    <div className="homePage">
      <div className={`topSection ${!selectedCity ? "centered" : "compact"}`}>
        <h1 className="pageTitle">Travel Planner</h1>
        
        <div className="searchBar">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => searchInput.length > 0 && setShowSuggestions(true)}
            placeholder="Search countries or cities..."
            className="searchBarInput"
            autoComplete="off"
          />

          {loading && <div className="loadingThing">Loading...</div>}

          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestionsDropdown">
              {suggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="suggestionItem"
                  role="option"
                >
                  <div className="suggestionName">{suggestion.name}</div>
                  <div className="suggestionThing">
                    {suggestion.type === 'country' ? 'Country' : 'City'} {suggestion.countryName && `• ${suggestion.countryName}`}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!selectedCity && (
          <div className="messageThingy">
            <p>🌍 Search for a country or city to start planning your trip</p>
          </div>
        )}

        {selectedCountry && popularCities.length > 0 && !selectedCity && (
          <div className="popularDestinations">
            <h3>Popular Destinations in {selectedCountry}</h3>
            <div className="destinations-grid">
              {popularCities.map((city, idx) => (
                <button key={idx} onClick={() => handleSelectCity(city)} className="destination-btn">
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedCity && selectedCountry && (
          <div className="selectedLocation">
            <h2>{selectedCity}, {selectedCountry}</h2>
            <div className="tripButtons">
              <button onClick={handleSaveTrip} className="saveTrip">
                💾 Save Trip
              </button>
              <button onClick={handleClearTrip} className="clearTrip">
                🗑️ Clear Trip
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedCity && selectedCountry && (
        <div className="homeInsides">
          <Weather city={selectedCity} />
          <Map city={selectedCity} savedAttractions={savedAttractions} setSavedAttractions={setSavedAttractions} />
          <TripBudgetCalculator budget={budget} setBudget={setBudget}/>
          <CurrencyConverter baseBudget={budget}/>
        </div>
      )}


    </div>
  );
}

export default Home
