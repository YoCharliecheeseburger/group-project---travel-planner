import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from '../assets/mapMarker.png';
import '../index.css';

const customMarkerIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? JSON.parse(decodeURIComponent(match[2])) : [];
};

const setCookie = (name, value) => {
  document.cookie = `${name}=${encodeURIComponent(
    JSON.stringify(value)
  )}; path=/; max-age=${60 * 60 * 24 * 30}`;
};

const API_KEY = 'afded785592a02f56aa62b6b57f085a5';
const OPENTRIP_API_KEY = '5ae2e3f221c38a28845f05b6f0feab42e232c8c6d12764264e933f31';

export default function Map({ city }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersLayer = useRef(null);
  const markerRefs = useRef({});

  const [attractions, setAttractions] = useState([]);
  const [savedAttractions, setSavedAttractions] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cookieKey = city ? `trip_saves_${city}` : null;

  useEffect(() => {
    if (!cookieKey) return;
    setSavedAttractions(getCookie(cookieKey));
  }, [cookieKey]);

  const toggleSave = useCallback((attraction) => {
    setSavedAttractions((prev) => {
      const exists = prev.some((a) => a.id === attraction.id);

      const updated = exists
        ? prev.filter((a) => a.id !== attraction.id)
        : [...prev, attraction];

      if (cookieKey) setCookie(cookieKey, updated);

      return updated;
    });
  }, [cookieKey]);

  const isSaved = (id) => savedAttractions.some((a) => a.id === id);

  /* ---------------- FIX: update popup button text dynamically ---------------- */
  useEffect(() => {
    Object.entries(markerRefs.current).forEach(([id]) => {
      const btn = document.getElementById(`btn-${id}`);
      if (btn) {
        btn.textContent = isSaved(id) ? 'Unsave' : 'Save';
      }
    });
  }, [savedAttractions]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = L.map(mapContainer.current, {
      center: [40.7128, -74.006],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);

    markersLayer.current = L.layerGroup().addTo(mapRef.current);

    setTimeout(() => mapRef.current?.invalidateSize(), 200);

    const handleResize = () => {
      setTimeout(() => mapRef.current?.invalidateSize(), 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const fetchCityAttractions = async (cityName) => {
    try {
      setLoading(true);
      setError(null);

      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
      );

      const geoData = await geoRes.json();

      if (!geoData?.length) {
        setError('City not found');
        return;
      }

      const { lat, lon, name } = geoData[0];

      setCurrentLocation({ name, lat, lng: lon });

      mapRef.current?.setView([lat, lon], 13);
      setTimeout(() => mapRef.current?.invalidateSize(), 100);

      let all = [];

      for (const r of [2000, 5000, 8000]) {
        const res = await fetch(
          `https://api.opentripmap.com/0.1/en/places/radius?radius=${r}&lon=${lon}&lat=${lat}&limit=80&format=json&apikey=${OPENTRIP_API_KEY}`
        );

        const data = await res.json();
        if (Array.isArray(data)) all.push(...data);
      }

      const unique = new globalThis.Map();

      all.forEach((i) => i?.xid && unique.set(i.xid, i));

      const formatted = Array.from(unique.values())
        .filter((i) => i?.name && i?.point)
        .map((i) => ({
          id: i.xid,
          name: i.name,
          lat: i.point.lat,
          lng: i.point.lon,
          type: i.kinds?.split(',')[0]?.replaceAll('_', ' ') || 'place',
        }));

      setAttractions(formatted);

      markersLayer.current?.clearLayers();
      markerRefs.current = {};

      formatted.forEach((a) => {
        const marker = L.marker([a.lat, a.lng], {
          icon: customMarkerIcon,
        });

        const btnId = `btn-${a.id}`;

        marker.bindPopup(`
          <div class="markerPopup">
            <h4>${a.name}</h4>
            <p>${a.type}</p>

            <button id="${btnId}">
              ${isSaved(a.id) ? 'Unsave' : 'Save'}
            </button>
          </div>
        `);

        marker.on('popupopen', () => {
          setTimeout(() => {
            const btn = document.getElementById(btnId);
            if (btn) btn.onclick = () => toggleSave(a);
          }, 0);
        });

        marker.addTo(markersLayer.current);
        markerRefs.current[a.id] = marker;
      });

    } catch (err) {
      console.error(err);
      setError('Failed to load attractions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!city) return;
    fetchCityAttractions(city);
  }, [city]);

  return (
    <div className="mapSidebarHolder">
      <div className="mapParent">
        <div ref={mapContainer} className="map" />
      </div>

      <div className="mapSidebar">
        {currentLocation && <p>Viewing {currentLocation.name}</p>}

        <h3>Saved ({savedAttractions.length})</h3>

        <div className="savedRestAttrList">
          {savedAttractions.map((a) => (
            <div key={a.id} className="savedRestAttrCard">
              <h4>{a.name}</h4>
              <button
                className="attractionRemove saved"
                onClick={() => toggleSave(a)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <h3>Nearby ({attractions.length})</h3>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        <div className="attractionsScroll">
          {attractions.map((a) => (
            <div key={a.id} className="attractionCard">
              <h4>{a.name}</h4>
              <small>{a.type}</small>

              <button
                className={`attractionSave ${isSaved(a.id) ? 'saved' : ''}`}
                onClick={() => toggleSave(a)}
              >
                {isSaved(a.id) ? 'Saved' : 'Save'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}