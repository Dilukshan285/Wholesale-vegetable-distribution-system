import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaTruck, FaUser, FaGasPump } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // For bar chart

const VFDashboard = () => {
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [activeDrivers, setActiveDrivers] = useState(0);
  const [fuelUsage, setFuelUsage] = useState(0);
  const [fuelCostData, setFuelCostData] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total vehicles
        const vehiclesResponse = await axios.get('http://localhost:3001/vehicle');
        const vehicles = vehiclesResponse.data;
        setTotalVehicles(vehicles.length);

        // Fetch active drivers
        const driversResponse = await axios.get('http://localhost:3001/driver/');
        const driverData = driversResponse.data;
        setDrivers(driverData);
        setActiveDrivers(driverData.length);

        // Fetch fuel purchase data
        const fuelResponse = await axios.get('http://localhost:3001/fuelpurchase');
        const fuelRecords = fuelResponse.data;

        // Calculate total fuel usage
        const totalFuelUsage = fuelRecords.reduce((sum, record) => sum + record.liters, 0);
        setFuelUsage(totalFuelUsage);

        // Aggregate fuel cost data by vehicle
        const fuelCostByVehicle = {};
        fuelRecords.forEach(record => {
          fuelCostByVehicle[record.registerNo] = (fuelCostByVehicle[record.registerNo] || 0) + record.cost;
        });

        // Fetch maintenance data
        const maintenanceResponse = await axios.get('http://localhost:3001/maintain'); // Make sure this endpoint exists
        const maintenanceRecords = maintenanceResponse.data;

        // Aggregate maintenance cost data by vehicle
        const maintenanceCostByVehicle = {};
        maintenanceRecords.forEach(record => {
          maintenanceCostByVehicle[record.registerNo] = (maintenanceCostByVehicle[record.registerNo] || 0) + record.totalCost;
        });

        // Combine fuel and maintenance costs
        const combinedCostByVehicle = {};
        Object.keys(fuelCostByVehicle).forEach(vehicle => {
          combinedCostByVehicle[vehicle] = {
            fuelCost: fuelCostByVehicle[vehicle] || 0,
            maintenanceCost: maintenanceCostByVehicle[vehicle] || 0,
          };
        });

        // Prepare data for the chart
        const vehicleNumbers = Object.keys(combinedCostByVehicle);
        const fuelCosts = vehicleNumbers.map(vehicle => combinedCostByVehicle[vehicle].fuelCost);
        const maintenanceCosts = vehicleNumbers.map(vehicle => combinedCostByVehicle[vehicle].maintenanceCost);

        setFuelCostData({
          labels: vehicleNumbers,
          datasets: [
            {
              label: 'Fuel Cost (LKR)',
              data: fuelCosts,
              backgroundColor: 'rgba(75,192,192,0.6)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
            },
            {
              label: 'Maintenance Cost (LKR)',
              data: maintenanceCosts,
              backgroundColor: 'rgba(255,99,132,0.6)',
              borderColor: 'rgba(255,99,132,1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const getLicenseExpiryDates = () => {
    return drivers.map(driver => {
      const date = new Date(driver.licenseExpDate);
      return {
        date: date,
        nic: driver.nic,
        note: `License for NIC: ${driver.nic} expires on ${date.toLocaleDateString()}`,
      };
    });
  };

  const licenseExpiryDates = getLicenseExpiryDates();
  const handleDateChange = (date) => setSelectedDate(date);

  const notes = licenseExpiryDates
    .filter(entry => entry.date.toDateString() === selectedDate.toDateString())
    .map(entry => entry.note);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition">
            <FaTruck className="text-4xl text-green-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Total Vehicles</h3>
            <p className="text-3xl font-bold text-gray-700">{totalVehicles}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition">
            <FaUser className="text-4xl text-blue-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Active Drivers</h3>
            <p className="text-3xl font-bold text-gray-700">{activeDrivers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition">
            <FaGasPump className="text-4xl text-red-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Overall Fuel Usage</h3>
            <p className="text-3xl font-bold text-gray-700">{fuelUsage.toLocaleString()} Liters</p>
          </div>
        </div>

        {/* Fuel Cost Graph */}
        <div className="flex justify-between space-x-6 mb-8">
          {/* Fuel Cost by Vehicle */}
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
            <h3 className="text-xl font-semibold mb-4">Fuel Cost & Maintenance Cost by Vehicle</h3>
            <Bar data={fuelCostData} />
          </div>

          {/* Driver License Expiry Calendar */}
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
            <h3 className="text-xl font-semibold mb-4">Driver License Expiry Calendar</h3>
            <div className="relative">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileContent={({ date }) => {
                  const hasNote = licenseExpiryDates.some(
                    (entry) => entry.date.toDateString() === date.toDateString()
                  );
                  return hasNote ? (
                    <div className="absolute right-1 top-1 text-red-500 text-xl">⚠️</div>
                  ) : null;
                }}
                className="bg-white border border-gray-300 rounded-lg"
              />
            </div>
            {notes.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">
                  Notes for {selectedDate.toLocaleDateString()}:
                </h4>
                <ul className="list-disc list-inside pl-4">
                  {notes.map((note, index) => (
                    <li key={index} className="text-gray-700">{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VFDashboard;
