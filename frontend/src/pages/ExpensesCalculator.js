import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpensesCalculator = () => {
    const [registerNo, setRegisterNo] = useState('');
    const [vehicleRegistrations, setVehicleRegistrations] = useState([]);
    const [totalFuelCost, setTotalFuelCost] = useState(0);
    const [totalMaintainCost, setTotalMaintainCost] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch vehicle registration numbers from the server
        const fetchVehicleRegistrations = async () => {
            try {
                const response = await axios.get('http://localhost:3001/vehicle'); // Adjust this URL according to your API
                setVehicleRegistrations(response.data);
            } catch (error) {
                console.error('Error fetching vehicle registrations:', error);
                setError('Error fetching vehicle registrations. Please try again.');
            }
        };

        fetchVehicleRegistrations();
    }, []);

    const calculateExpenses = async () => {
        try {
            const fuelResponse = await axios.get(`http://localhost:3001/expenses/fuelpurchase?registerNo=${registerNo}`);
            const maintainResponse = await axios.get(`http://localhost:3001/expenses/maintain?registerNo=${registerNo}`);

            const totalFuelCost = fuelResponse.data.reduce((sum, record) => sum + record.cost, 0);
            const totalMaintainCost = maintainResponse.data.reduce((sum, record) => sum + record.totalCost, 0);

            setTotalFuelCost(totalFuelCost);
            setTotalMaintainCost(totalMaintainCost);
            setTotalExpenses(totalFuelCost + totalMaintainCost);
            setError(''); // Clear any previous error messages
        } catch (error) {
            console.error('Error fetching expenses:', error);
            setError('Error fetching expenses. Please try again.');
        }
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2,
        });
    };

    return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg overflow-auto">
    <h1 className="text-2xl font-bold mb-4">Expenses Calculator</h1>
    <div className="mb-4">
        <select
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={registerNo}
            onChange={(e) => setRegisterNo(e.target.value)}
        >
            <option value="">Select Vehicle Registration Number</option>
            {vehicleRegistrations.length > 0 ? (
                vehicleRegistrations.map(vehicle => (
                    <option key={vehicle._id} value={vehicle.registrationNo}>
                        {vehicle.registrationNo}
                    </option>
                ))
            ) : (
                <option value="">No vehicles available</option>
            )}
        </select>
    </div>
    <button
        className="w-full p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
        onClick={calculateExpenses}
    >
        Calculate
    </button>
    
    {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
    
    <div className="mt-6 p-4  rounded overflow-auto">
        <table className="w-full table-auto border-collapse mb-6">
            <thead className="bg-gray-200">
                <tr>
                    <th className="px-4 py-2 border">Expense Type</th>
                    <th className="px-4 py-2 border">Cost (LKR)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="px-4 py-2 border">Total Fuel Cost</td>
                    <td className="px-4 py-2 border">{formatCurrency(totalFuelCost)}</td>
                </tr>
                <tr>
                    <td className="px-4 py-2 border">Total Maintenance Cost</td>
                    <td className="px-4 py-2 border">{formatCurrency(totalMaintainCost)}</td>
                </tr>
                <tr>
                    <td className="px-4 py-2 border p-2 font-bold">Total Expenses</td>
                    <td className="px-4 py-2 border p-2 font-bold">{formatCurrency(totalExpenses)}</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>


    );
};

export default ExpensesCalculator;
