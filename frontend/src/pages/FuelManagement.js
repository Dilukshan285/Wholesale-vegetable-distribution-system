import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../components/LogoImage.png';

const FuelManagement = () => {
  const [fuelpurchases, setFuelpurchases] = useState([]);
  const [vehicleRegistrations, setVehicleRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [fuelEfficiency, setFuelEfficiency] = useState(null);
  const [minCost, setMinCost] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [registerNo, setRegisterNo] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/fuelpurchase/')
      .then(response => {
        setFuelpurchases(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the fuel purchases data!', error);
      });

    axios.get('http://localhost:3001/vehicle/')
      .then(response => {
        setVehicleRegistrations(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the vehicle registrations!', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/efficiency/', { registerNo, year, month })
      .then(response => {
        setFuelEfficiency(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the fuel efficiency data!', error.response ? error.response.data : error.message);
      });
  };

  // Function to generate a PDF with fuel efficiency data
  const generatePDF = () => {
    if (!fuelEfficiency) {
      alert('No fuel efficiency data available!');
      return;
    }

    const doc = new jsPDF();

    // Company Header
    const companyName = 'GSP Traders Pvt Ltd';
    const address = 'A12, Dedicated Economic Centre, Nuwara Eliya, Sri Lanka';
    const email = 'gsptraders29@gmail.com';
    const phone = '+94 77 7144 133';
    
   
    // Set company details color and font
    // Set company details
    doc.setTextColor('#11532F'); // Company green color
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName, 195, 20, { align: 'right' }); // Center company name

    const imgData = logo;  // Use imported logo
    doc.addImage(imgData, 'PNG', 15, 15, 25, 25);  

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(address, 195, 28, { align: 'right' }); // Center address
    doc.text(`Email: ${email}`, 195, 34, { align: 'right' }); // Center email
    doc.text(`Phone: ${phone}`, 195, 40, { align: 'right' }); // Center phone

    // Divider
    doc.setDrawColor('#11532F');
    doc.setLineWidth(1);
    doc.line(10, 50, 200, 50);

    // Add a title for the report
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Reset color to black
    doc.setFont('helvetica', 'bold');
    doc.text('Monthly Fuel Efficiency Report', 105, 60, { align: 'center' }); // Center title

    // Section for vehicle details
    doc.setFontSize(14);
    doc.setTextColor('#11532F');
    doc.text('Vehicle Information:', 20, 75); // Section title

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Reset color to black
    doc.setFont('helvetica', 'normal');
    doc.text('Vehicle Registration No:', 20, 85);
    doc.setFont('helvetica', 'bold');
    doc.text(`${fuelEfficiency.registerNo}`, 70, 85); // Registration number

    // Table for Year and Month
    doc.autoTable({
      startY: 95,
      head: [['Year', 'Month']],
      body: [[`${fuelEfficiency.year}`, `${fuelEfficiency.month}`]],
      theme: 'grid',
      headStyles: { fillColor: '#11532F' },
      margin: { left: 20, right: 20 },
    });

    // Section for Fuel Efficiency Details (specific to the selected year and month)
    doc.setFontSize(14);
    doc.setTextColor('#11532F');
    doc.text('Fuel Efficiency Details:', 20, doc.lastAutoTable.finalY + 20,); // Section title
    

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Table for Fuel Efficiency Details
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 30,
      head: [['Total Fuel Efficiency (Km/L)', 'Total Cost Per Liter (LKR)', 'Total Cost Per Kilometer (LKR)']],
      body: [[
        fuelEfficiency.totalFuelEfficiency !== null ? fuelEfficiency.totalFuelEfficiency.toFixed(2) : 'N/A',
        fuelEfficiency.totalCostPerLiter !== null ? fuelEfficiency.totalCostPerLiter.toFixed(2) : 'N/A',
        fuelEfficiency.totalCostPerKilometer !== null ? fuelEfficiency.totalCostPerKilometer.toFixed(2) : 'N/A'
      ]],
      theme: 'grid',
      headStyles: { fillColor: '#11532F' },
      margin: { left: 20, right: 20 },
    });

    // Divider for separation
    doc.setDrawColor('#11532F');
    doc.setLineWidth(0.5);
    doc.line(10, doc.lastAutoTable.finalY + 50, 200, doc.lastAutoTable.finalY + 50);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated on: ' + new Date().toLocaleDateString(), 105, doc.lastAutoTable.finalY + 60, { align: 'center' });



    // Save the PDF
    doc.save(`Fuel_Efficiency_Report_${fuelEfficiency.registerNo}_${fuelEfficiency.year}_${fuelEfficiency.month}.pdf`);
  };

  const filteredFuelPurchases = fuelpurchases.filter(fuelpurchase => {
    const searchText = searchQuery.toLowerCase();
    const matchesSearch = 
      fuelpurchase.driverNic.toLowerCase().includes(searchText) ||
      fuelpurchase.registerNo.toLowerCase().includes(searchText);
    const matchesCost = (minCost || maxCost) ? 
      (fuelpurchase.cost >= (minCost || 0) && fuelpurchase.cost <= (maxCost || Infinity)) : true;
    return matchesSearch && matchesCost;
  });

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Fuel Purchase Management</h2>
      
      {/* Search and Filter Section */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          placeholder="Search NIC or Vehicle Registration No"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <h5 className="text-lg font-semibold mb-2">Sort by</h5>
        <div className="flex space-x-4 mb-4">
          <label className="flex flex-col">
            Min Cost:
            <input
              type="number"
              value={minCost}
              onChange={(e) => setMinCost(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="flex flex-col">
            Max Cost:
            <input
              type="number"
              value={maxCost}
              onChange={(e) => setMaxCost(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Fuel Purchases Table */}
      <table className="w-full table-auto border-collapse mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Driver NIC</th>
            <th className="px-4 py-2 border">Vehicle Registration No</th>
            <th className="px-4 py-2 border">Mileage(Km)</th>
            <th className="px-4 py-2 border">Liters</th>
            <th className="px-4 py-2 border">Cost(LKR)</th>
          </tr>
        </thead>
        <tbody>
          {filteredFuelPurchases.length > 0 ? (
            filteredFuelPurchases.map(fuelpurchase => (
              <tr key={fuelpurchase._id}>
                <td className="px-4 py-2 border">{fuelpurchase.driverNic}</td>
                <td className="px-4 py-2 border">{fuelpurchase.registerNo}</td>
                <td className="px-4 py-2 border">{fuelpurchase.mileage}</td>
                <td className="px-4 py-2 border">{fuelpurchase.liters}</td>
                <td className="px-4 py-2 border">{fuelpurchase.cost}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-center">No fuel purchases found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Fuel Efficiency Calculation Form */}
      <h2 className="text-2xl font-bold mb-4">Fuel Efficiency Calculation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col">
          Registration No:
          <select 
            value={registerNo} 
            onChange={(e) => setRegisterNo(e.target.value)} 
            required
            className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Registration No</option>
            {vehicleRegistrations.length > 0 ? vehicleRegistrations.map(vehicle => (
              <option key={vehicle._id} value={vehicle.registrationNo}>
                {vehicle.registrationNo}
              </option>
            )) : <option value="">No vehicles found</option>}
          </select>
        </label>
        <label className="flex flex-col">
          Year:
          <input 
            type="number" 
            value={year} 
            onChange={(e) => setYear(e.target.value)} 
            required 
            className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col">
          Month:
          <input 
            type="number" 
            value={month} 
            onChange={(e) => setMonth(e.target.value)} 
            required 
            className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Calculate
        </button>
      </form>

      {/* Show Fuel Efficiency Results and Generate PDF */}
      {fuelEfficiency && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Fuel Efficiency Results</h3>
          <p><strong>Vehicle Registration No:</strong> {fuelEfficiency.registerNo}</p>
          <p><strong>Year:</strong> {fuelEfficiency.year}</p>
          <p><strong>Month:</strong> {fuelEfficiency.month}</p>
          <p><strong>Total Fuel Efficiency:</strong> {fuelEfficiency.totalFuelEfficiency !== null ? fuelEfficiency.totalFuelEfficiency.toFixed(2) : 'N/A'} Km/L</p>
          <p><strong>Total Cost Per Liter:</strong> {fuelEfficiency.totalCostPerLiter !== null ? fuelEfficiency.totalCostPerLiter.toFixed(2) : 'N/A'} LKR</p>
          <p><strong>Total Cost Per Kilometer:</strong> {fuelEfficiency.totalCostPerKilometer !== null ? fuelEfficiency.totalCostPerKilometer.toFixed(2) : 'N/A'} LKR</p>
          <button 
            onClick={generatePDF} 
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Generate PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default FuelManagement;
