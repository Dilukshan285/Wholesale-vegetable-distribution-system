// LandForm.js
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";

const LandForm = () => {
  const [landSize, setLandSize] = useState("");
  const [landLocation, setLandLocation] = useState("");
  const [soilType, setSoilType] = useState("");
  const [cropsGrown, setCropsGrown] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  // This will allow the user to click on the map to get lat/lng
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setCoordinates({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      }
    });
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const landData = {
        farmerId: "FARMER_ID", // Replace with actual farmerId
        landSize,
        landLocation,
        lat: coordinates.lat,
        lng: coordinates.lng,
        soilType,
        cropsGrown: cropsGrown.split(",")
      };
      await axios.post("http://localhost:3001/land/add", landData);
      alert("Land information added successfully");
    } catch (error) {
      console.error("Error submitting land info:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Land Size:</label>
        <input type="number" value={landSize} onChange={(e) => setLandSize(e.target.value)} required />
      </div>
      <div>
        <label>Land Location:</label>
        <input type="text" value={landLocation} onChange={(e) => setLandLocation(e.target.value)} required />
      </div>
      <div>
        <label>Soil Type:</label>
        <input type="text" value={soilType} onChange={(e) => setSoilType(e.target.value)} required />
      </div>
      <div>
        <label>Crops Grown (comma-separated):</label>
        <input type="text" value={cropsGrown} onChange={(e) => setCropsGrown(e.target.value)} required />
      </div>

      {/* Map */}
      <div style={{ height: "400px" }}>
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {coordinates.lat && coordinates.lng && <Marker position={[coordinates.lat, coordinates.lng]} />}
          <MapClickHandler />
        </MapContainer>
      </div>

      <button type="submit">Submit Land Information</button>
    </form>
  );
};

export default LandForm;
