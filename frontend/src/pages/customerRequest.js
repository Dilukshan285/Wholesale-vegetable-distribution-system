import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const locationIconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";

export default function CustomerRequest() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [customerRequest, setCustomerRequest] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const navigate = useNavigate();
  const apiUrl = "http://localhost:3001/api";
  const warehouseCoordinates = [6.9605, 80.7907]; // Replace with the actual coordinates
  const warehouseLocation = "Nuwara Eliya-Uda Pussellawa Rd, Nuwara Eliya, Sri Lanka";

  const locationIcon = L.icon({
    iconUrl: locationIconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(warehouseCoordinates, 13);

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
    if (pickupLocation.trim() === "") {
      setError("Please enter a location.");
      return;
    }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${pickupLocation}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const userMarker = L.marker([lat, lon], { icon: locationIcon }).addTo(mapInstance.current);
          
          // Calculate bounds for both markers
          const bounds = L.latLngBounds([lat, lon], warehouseCoordinates);
          mapInstance.current.fitBounds(bounds);

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
    // Ensure pickup location is filled and has at least 3 characters
    if (pickupLocation.trim().length < 3) {
      return "Pickup location must be at least 3 characters.";
    }

    // Ensure the date is in the future
    const currentDate = new Date();
    const selectedDate = new Date(pickupDate);
    if (!pickupDate || selectedDate <= currentDate) {
      return "Please select a valid future date.";
    }

    // Ensure time is selected
    if (!pickupTime) {
      return "Please select a valid time.";
    }

    // Ensure vehicle type is selected
    if (!selectedVehicle) {
      return "Please select a vehicle type.";
    }

    return null; // No errors, form is valid
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const errorMessage = validateForm(); // Validate form before submission
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    navigate("/customerRequestDB");

    fetch(apiUrl + "/customerRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pickupLocation,   // Ensure these values are correctly populated
        pickupDate,       // Ensure the date is in the correct format
        pickupTime,
        selectedVehicle,  // Must match the enum in your schema
      }),

      
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCustomerRequest([
          ...customerRequest,
          { pickupLocation, pickupDate, pickupTime, selectedVehicle },
        ]);
        setSuccessMessage("Customer request added successfully");
        setError("");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);

        // navigate("/customerRequestDB");
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Failed to create customer request. Please try again.");
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
              <h2 className="text-2xl mb-4 text-gray-800 font-semibold">Customer Delivery Request</h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="block text-left">Delievry Location</label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter your location"
                      className="w-full p-3 border border-gray-300 rounded-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105"
                      onChange={(e) => setPickupLocation(e.target.value)}
                      value={pickupLocation}
                    />
                    <button
                      type="button"
                      onClick={handleLocationSearch}
                      className="ml-2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Find Location
                    </button>
                  </div>
                  {error && <div className="text-red-500">{error}</div>}
                </div>

                <div className="space-y-2">
                  <label className="block text-left">Delivery Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105"
                    onChange={(e) => setPickupDate(e.target.value)}
                    value={pickupDate}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-left">Delievry Time</label>
                  <input
                    type="time"
                    className="w-full p-3 border border-gray-300 rounded-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105"
                    onChange={(e) => setPickupTime(e.target.value)}
                    value={pickupTime}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-left">Vehicle Type</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105"
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    value={selectedVehicle}
                  >
                    <option value="">Select a vehicle</option>
                    <option value="farmer">Farmer Vehicle</option>
                    <option value="company">Company Vehicle</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-transform duration-300"
                >
                  Submit Delivery Request
                </button>
              </form>
              {successMessage && <div className="text-green-500">{successMessage}</div>}
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
