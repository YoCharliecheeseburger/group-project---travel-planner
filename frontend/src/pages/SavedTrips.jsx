import React, { useEffect, useState } from 'react';
import Weather from '../features/weather.jsx';
import Map from '../features/map.jsx';
import TripBudgetCalculator from '../features/TripBudgetCalculator.jsx';
import CurrencyConverter from '../features/CurrencyConverter.jsx';
import TripCards from '../components/TripCards';

function SavedTrips() {
  const [SavedTrips, setSavedTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [budget, setBudget] = useState(1500);

  const fetchTrips = async () => {
    const res = await fetch("http://localhost:3000/trips");
    const data = await res.json();
    setSavedTrips(data);
  };

  const deleteTrip = async (id) => {
    await fetch(`http://localhost:3000/trips/${id}`, {
      method: "DELETE",
    });

    fetchTrips();
    if (selectedTrip?.id === id) setSelectedTrip(null);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className='savedTripsInside'>

      <TripCards
        SavedTrips={SavedTrips}
        deleteTrip={deleteTrip}
        viewTrip={setSelectedTrip}
      />

      {selectedTrip && (
        <div className="homeInsides homeInsidesMyTrips">
          <h2>{selectedTrip.name}</h2>

          <Weather city={selectedTrip.destination} />
          <Map
            city={selectedTrip.destination}
            savedAttractions={selectedTrip.attractions || []}
            setSavedAttractions={(updated) => {
              setSelectedTrip((prev) => {
                if (!prev) return prev;
                return { ...prev, attractions: updated };
              });

              fetch(`http://localhost:3000/trips/${selectedTrip.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...selectedTrip,
                  attractions: updated,
                }),
              });
            }}
          />
          <TripBudgetCalculator budget={budget} setBudget={setBudget} />
          <CurrencyConverter baseBudget={budget} />
        </div>
      )}

    </div>
  );
}

export default SavedTrips;