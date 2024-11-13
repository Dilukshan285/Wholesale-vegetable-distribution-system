import React, { useState, useEffect } from 'react';
import WeatherWidget from './WeatherWidget';
import CalendarWidget from './CalendarWidget';
import PickupRequestChart from './PickupRequestChart';
import StatsCard from './StatsCard';
import CropReadinessChart from "./CropReadinessChart"; // Import the CropReadinessChart component

const AdminDashboardFarmer = () => {
  // State for counts
  const [farmerCount, setFarmerCount] = useState(0);
  const [pickupRequestCount, setPickupRequestCount] = useState(0);
  const [cropReadinessCount, setCropReadinessCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({ Pending: 0, InProgress: 0, Completed: 0 });

  // Fetch counts from API
  useEffect(() => {
    // Fetch farmer count
    fetch('http://localhost:3001/farmer/api/farmers/count')
      .then(response => response.json())
      .then(data => setFarmerCount(data.count))
      .catch(error => console.error('Error fetching farmer count:', error));

    // Fetch pickup request count
    fetch('http://localhost:3001/pickup-request/api/pickup-requests/count')
      .then(response => response.json())
      .then(data => setPickupRequestCount(data.count))
      .catch(error => console.error('Error fetching pickup request count:', error));

    // Fetch crop readiness count and status counts
    fetch('http://localhost:3001/cropReadiness/api/crop-readiness/count')
      .then(response => response.json())
      .then(data => {
        setCropReadinessCount(data.count);
        setStatusCounts({
          Pending: data.statusCounts.Pending,
          InProgress: data.statusCounts.InProgress,
          Completed: data.statusCounts.Completed
        });
      })
      .catch(error => console.error('Error fetching crop readiness count:', error));
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Dashboard Header */}
      <h1 className="text-3xl font-semibold text-gray-700">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        <StatsCard title="Total Farmers" value={farmerCount} />
        <StatsCard title="Pickup Requests" value={pickupRequestCount} />
        <StatsCard title="Crop Readiness Requests" value={cropReadinessCount} />
      </div>

      {/* Weather and Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <WeatherWidget />
        <CalendarWidget />
      </div>

      {/* Bar and Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <PickupRequestChart title="Pickup Requests Over Time" />
        <CropReadinessChart statusCounts={statusCounts} /> {/* Pass statusCounts to CropReadinessChart */}
      </div>
    </div>
  );
};

export default AdminDashboardFarmer;
