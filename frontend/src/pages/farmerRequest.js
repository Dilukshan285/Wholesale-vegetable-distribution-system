import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const locationIconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";

export default function FarmerRequest() {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [vehicleOption, setVehicleOption] = useState("");
  const [customerRequest, setCustomerRequest] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const warehouseLocation = "Nuwara Eliya-Uda Pussellawa Rd, Nuwara Eliya, Sri Lanka";
  const navigate = useNavigate();
  const apiUrl = "http://localhost:3001/api";
  const warehouseCoordinates = [6.9605, 80.7907];

  const locationIcon = L.icon({
    iconUrl: locationIconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([6.9605, 80.7907], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstance.current);

      // Add warehouse marker to the map initially
      L.marker(warehouseCoordinates, { icon: locationIcon })
        .addTo(mapInstance.current)
        .bindPopup("Warehouse Location: Nuwara Eliya")
        .openPopup();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  const handleLocationSearch = () => {
    if (location.trim() === "") {
      setError("Please enter a location.");
      return;
    }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const userMarker = L.marker([lat, lon], { icon: locationIcon }).addTo(mapInstance.current);
          
          // Calculate bounds for both markers
          const bounds = L.latLngBounds([lat, lon], warehouseCoordinates);
          mapInstance.current.fitBounds(bounds);

          // Fetch alternative routes
          fetch(`https://router.project-osrm.org/v1/driving/${lon},${lat};${warehouseCoordinates[1]},${warehouseCoordinates[0]}?overview=false&alternatives=true`)
            .then(res => res.json())
            .then(routeData => {
              if (routeData.routes && routeData.routes.length > 0) {
                const routePromises = routeData.routes.map(route => {
                  const routeCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                  const polyline = L.polyline(routeCoords, { color: "blue" }).addTo(mapInstance.current);
                  mapInstance.current.fitBounds(polyline.getBounds());

                  const duration = route.duration / 60; // Convert to minutes
                  return `Estimated time: ${Math.round(duration)} minutes`;
                });

                Promise.all(routePromises).then((estimatedTimes) => {
                  setSuccessMessage(estimatedTimes.join(", "));
                });
              } else {
                setError("No routes found.");
              }
            })
            .catch(err => {
              console.error(err);
              setError("Failed to fetch routes.");
            });

          setError("");
        } else {
          setError("Location not found.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to search for the location.");
      });
  };

  const validateForm = () => {
    if (location.trim().length < 3) {
      return "Pickup location must be at least 3 characters.";
    }

    const currentDate = new Date();
    const selectedDate = new Date(date);
    if (!date || selectedDate <= currentDate) {
      return "Please select a valid future date.";
    }

    if (!time) {
      return "Please select a valid time.";
    }

    if (!vehicleOption) {
      return "Please select a vehicle type.";
    }
    
    return null; // No errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    fetch(apiUrl + "/farmerRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location,
        date,
        time,
        vehicleOption,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCustomerRequest([...customerRequest, { location, date, time, vehicleOption }]);
        setSuccessMessage("Farmer request added successfully");
        setError("");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);

        navigate("/farmerRequestDB");
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Failed to create farmer request. Please try again.");
      });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="fixed top-0 left-0 h-full w-60 bg-green-800 text-white flex flex-col py-4 px-6 shadow-lg">
        <h2 className="text-xl mb-8">G S P Traders</h2>
        <nav className="space-y-4">
          <Link to="/farmerRequest" className="flex items-center space-x-2 hover:underline">
            <span>🚜</span>
            <span>Farmer requests</span>
          </Link>
          <Link to="/customerRequest" className="flex items-center space-x-2 hover:underline">
            <span>🛒</span>
            <span>Customer requests</span>
          </Link>
        </nav>
      </div>

      <div className="flex-grow ml-60 flex justify-center items-center">
        <div className="flex w-full max-w-7xl mx-auto shadow-lg rounded-lg overflow-hidden">
          <div className="w-1/2 bg-white p-8 md:p-12 flex justify-center items-center">
            <div className="w-full max-w-md">
              <h2 className="text-2xl mb-4 text-gray-800 font-semibold">Farmer Pickup Requests</h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="block text-left">Pickup Location</label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter your location"
                      className="w-full p-3 border border-gray-300 rounded-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105"
                      onChange={(e) => setLocation(e.target.value)}
                      value={location}
                    />
                    <button
                      type="button"
                      onClick={handleLocationSearch}
                      className="ml-2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Find Location
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-left">Pickup Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-left">Pickup Time</label>
                  <input
                    type="time"
                    className="w-full p-3 border border-gray-300 rounded-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105"
                    onChange={(e) => setTime(e.target.value)}
                    value={time}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-left">Vehicle</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105"
                    onChange={(e) => setVehicleOption(e.target.value)}
                    value={vehicleOption}
                  >
                    <option value="">Select Vehicle</option>
                    <option value="Farmer Vehicle">Farmer Vehicle</option>
                    <option value="Company Vehicle">Company Vehicle</option>
                  </select>
                </div>

                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}
                <button type="submit" className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
                  Submit Pickup request
                </button>
              </form>
            </div>
          </div>

          <div className="w-1/2 bg-gray-200">
            <div className="h-full" style={{ height: '100%' }}>
              <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
