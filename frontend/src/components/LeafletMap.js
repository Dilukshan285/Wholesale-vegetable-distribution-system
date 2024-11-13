import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for missing marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const LeafletMap = ({ location }) => {
  const mapRef = useRef(null); // Ref for the map container
  const markerRef = useRef(null); // Ref for the marker
  const mapInstanceRef = useRef(null); // Ref for the Leaflet map instance

  // Setting default icon for Leaflet markers
  const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconAnchor: [12, 41], // Adjust anchor so the marker points at the correct location
  });

  useEffect(() => {
    // Ensure that location is defined and has valid lat and lng properties
    const validLat = location?.lat ?? 7.8731; // Default to Sri Lanka if lat is undefined
    const validLng = location?.lng ?? 80.7718; // Default to Sri Lanka if lng is undefined

    if (!mapInstanceRef.current) {
      // Initialize the map
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [validLat, validLng], // Use valid location
        zoom: 7, // Zoom level
      });

      // Add the tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstanceRef.current);

      // Add marker with the initial valid location
      markerRef.current = L.marker([validLat, validLng], { icon: DefaultIcon }).addTo(mapInstanceRef.current);
    }

    // Function to update marker position
    const updateMarker = () => {
      if (markerRef.current) {
        markerRef.current.setLatLng([validLat, validLng]);
        mapInstanceRef.current.setView([validLat, validLng], 13); // Update the map view to center on the new location
      }
    };

    // Update marker and map when location changes
    updateMarker();

    // Cleanup on component unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove(); // Ensure the map is removed to prevent memory leaks
        mapInstanceRef.current = null; // Reset the map instance ref
      }
    };
  }, [location, DefaultIcon]); // Re-run the effect if location or DefaultIcon changes

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>;
};

export default LeafletMap;
