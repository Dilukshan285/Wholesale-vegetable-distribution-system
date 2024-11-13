import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for missing default icon in Leaflet
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerIconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const DriverDashboard = () => {
    const driverName = localStorage.getItem('driverName');
    const [pickupRequests, setPickupRequests] = useState([]);
    const [vehicleSummary, setVehicleSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleRequests, setVisibleRequests] = useState(2); // Set initial visible requests
    const [visibleVehicles, setVisibleVehicles] = useState(2); // Set initial visible vehicles

    // Fetch pickup requests and vehicle info when the component loads
    useEffect(() => {
        const fetchPickupRequests = async () => {
            try {
                const requestsResponse = await axios.get('http://localhost:3001/pickup-request/all-pickup-requests');
                setPickupRequests(requestsResponse.data);
            } catch (error) {
                console.error('Error fetching pickup requests:', error);
            }
        };

        const fetchVehicleSummary = async () => {
            try {
                const vehicleResponse = await axios.get('http://localhost:3001/vehicle');
                setVehicleSummary(vehicleResponse.data);
            } catch (error) {
                console.error('Error fetching vehicle summary:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPickupRequests();
        fetchVehicleSummary();
    }, []);

    // Function to handle showing more requests
    const handleViewMore = () => {
        setVisibleRequests((prev) => prev + 2); // Increment the visible requests count
    };

    // Function to handle showing more vehicles
    const handleViewMoreVehicles = () => {
        setVisibleVehicles((prev) => prev + 2); // Increment the visible vehicles count
    };

    return (
        <div className="max-w-7xl mx-auto p-5">
            <h1 className="text-3xl font-bold text-center mb-8">Welcome, {driverName}!</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Pickup Requests</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : (
                        <div>
                            {pickupRequests.length === 0 ? (
                                <p className="text-gray-500">No pickup requests available.</p>
                            ) : (
                                <>
                                    {pickupRequests.slice(0, visibleRequests).map((request) => (
                                        <div key={request.id} className="border border-gray-300 rounded-lg p-4 mb-4">
                                            <h3 className="text-lg font-semibold">Pickup Request ID: {request.id}</h3>
                                            <p className="text-gray-600">
                                                Pickup Location: Latitude {request.location.lat}, Longitude {request.location.lng}
                                            </p>
                                            <p className="text-gray-600">Status: {request.status}</p>
                                        </div>
                                    ))}
                                    {visibleRequests < pickupRequests.length && (
                                        <button 
                                            className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
                                            onClick={handleViewMore}
                                        >
                                            View More
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Available Vehicles</h2>
                    {loading ? (
                        <p>Loading vehicle information...</p>
                    ) : (
                        <>
                            {vehicleSummary.length > 0 ? (
                                <>
                                    {vehicleSummary.slice(0, visibleVehicles).map((vehicle) => (
                                        <div key={vehicle._id} className="border border-gray-300 rounded-lg p-4 mb-4">
                                            <p className="text-lg font-semibold">
                                                <strong>Registration No:</strong> {vehicle.registrationNo}
                                            </p>
                                            <p className="text-gray-600">
                                                <strong>Manufacturing Year:</strong> {new Date(vehicle.manufacYear).getFullYear()}
                                            </p>
                                            <p className="text-gray-600">
                                                <strong>Mileage:</strong> {vehicle.mileage} km
                                            </p>
                                            <p className="text-gray-600">
                                                <strong>Dimensions:</strong> {vehicle.length}m (Length) x {vehicle.width}m (Width)
                                            </p>
                                        </div>
                                    ))}
                                    {visibleVehicles < vehicleSummary.length && (
                                        <button 
                                            className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
                                            onClick={handleViewMoreVehicles}
                                        >
                                            View More Vehicles
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p>No vehicle data available.</p>
                            )}
                        </>
                    )}
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Pickup Locations on Map</h2>
            <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
                <MapContainer center={[7.8731, 80.7718]} zoom={8} style={{ height: "400px", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                    />
                    {pickupRequests.map((request) => (
                        <Marker key={request.id} position={[request.location.lat, request.location.lng]}>
                            <Popup>
                                Pickup Request ID: {request.id} <br /> Status: {request.status}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default DriverDashboard;
