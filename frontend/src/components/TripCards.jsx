import React from 'react';

function TripCards({ SavedTrips, deleteTrip, viewTrip }) {
  return (
    <div className="SavedTrips">
      <h3>Saved Trips</h3>

      {SavedTrips.map((trip) => (
        <div
          key={trip.id}
          className="tripCard"
          onClick={() => viewTrip(trip)}
          style={{ cursor: 'pointer' }}
        >
          <p>{trip.name}</p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTrip(trip.id);
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default TripCards;