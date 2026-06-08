
export const geocodeLocation = async (location) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      location
    )}&format=json&limit=1`
  );

  if (!response.ok) throw new Error('Location not found');

  const data = await response.json();

  if (data.length === 0) {
    throw new Error('Location not found');
  }

  const result = data[0];
  return {
    name: result.display_name,
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon),
  };
};

export const fetchNearbyAttractions = async (lat, lng, radius = 0.05) => {
  return await fetchFromNominatimPOI(lat, lng, radius);
};

const fetchFromNominatimPOI = async (lat, lng, radius = 0.05) => {
  const attractionsList = [];

  const searchQueries = [
    { query: 'restaurant', type: 'restaurant' },
    { query: 'cafe', type: 'restaurant' },
    { query: 'pub', type: 'restaurant' },
    { query: 'attraction', type: 'attraction' },
    { query: 'museum', type: 'attraction' },
    { query: 'landmark', type: 'attraction' },
    { query: 'park', type: 'attraction' },
  ];

  for (const { query, type } of searchQueries) {
    if (attractionsList.length >= 30) break;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}+near+${lat},${lng}&format=json&limit=5&countrycodes=&viewbox=${lng - radius},${lat + radius},${lng + radius},${lat - radius}`
    );

    if (!response.ok) continue;

    const data = await response.json();

    data.forEach((place) => {
      if (attractionsList.length >= 30) return;

      const placeKey = `${place.lat}_${place.lon}`;
      
      if (!attractionsList.find((a) => `${a.lat}_${a.lng}` === placeKey)) {
        attractionsList.push({
          id: placeKey,
          name: place.name || 'Unnamed Place',
          type: type,
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
          rating: (Math.floor(Math.random() * 2) + 4 + Math.random()).toFixed(1),
        });
      }
    });
  }

  if (attractionsList.length === 0) {
    throw new Error('No attractions found');
  }

  return attractionsList.slice(0, 30);
};

const fetchNearbyAttractionsAlternative = async (lat, lng) => {
  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}%7C${lng}&gsradius=10000&gslimit=25&format=json&origin=*`
  );

  if (!response.ok) throw new Error('Wikipedia API failed');

  const data = await response.json();
  const attractionsList = [];

  if (data.query && data.query.geosearch) {
    data.query.geosearch.forEach((place) => {
      attractionsList.push({
        id: `wiki_${place.pageid}`,
        name: place.title,
        type: 'attraction',
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        rating: (4 + Math.random()).toFixed(1),
      });
    });
  }

  if (attractionsList.length === 0) {
    throw new Error('No Wikipedia articles found');
  }

  return attractionsList.slice(0, 30);
};

export const searchNearbyAttractions = async (locationName) => {
  const location = await geocodeLocation(locationName);
  const attractions = await fetchNearbyAttractions(location.lat, location.lng);
  return {
    location,
    attractions,
  };
};

export const fetchAttractionsByRadius = async (lat, lng, radiusKm = 5) => {
  const radiusDegrees = radiusKm / 111;
  return await fetchNearbyAttractions(lat, lng, radiusDegrees);
};
