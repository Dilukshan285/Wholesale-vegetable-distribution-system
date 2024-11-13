import React, { useState } from 'react';
import axios from 'axios';

export default function UpdateStocks() {
  const [vegType, setVegType] = useState('');
  const [qualityGrade, setQualityGrade] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRemoveStock = async (e) => {
    e.preventDefault();

    if (!vegType || !qualityGrade || !amount) {
      setError('All fields are required');
      return;
    }

    // Show confirmation popup
    const confirmed = window.confirm(`Are you sure you want to remove ${amount} units of ${vegType} (Grade ${qualityGrade})?`);
    if (!confirmed) {
      return; // Exit if the user cancels the action
    }

    try {
      const res = await axios.put(`http://localhost:3001/stock/remove-stock`, {
        vegType,
        qualityGrade,
        amount: parseInt(amount)
      });
      
      if (res.status === 200) {
        setSuccess('Stock successfully removed');
        setError('');
        setAmount('');
        setVegType('');
        setQualityGrade('');
      }
    } catch (err) {
      setError('Error removing stock: ' + err.response.data.error);
      setSuccess('');
    }
  };

  return (
    <div className="max-w-lg m-3 bg-white p-6 rounded-lg shadow-md flex-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Remove Stock</h2>
        <form className="space-y-6" onSubmit={handleRemoveStock}>
          <div>
            <label className="block text-m font-medium text-gray-700 mt-1">Vegetable Type</label>
            <select
              className="mt-1 block w-full h-12 border-2 border-gray-300 focus:border-green-500 rounded-md px-3"
              value={vegType}
              onChange={(e) => setVegType(e.target.value)}
              required
            >
              <option value="">Select Vegetable</option>
              <option value="Carrot">Carrot</option>
              <option value="Leeks">Leeks</option>
              <option value="Cabbage">Cabbage</option>
              <option value="Potato">Potato</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-m font-medium text-gray-700 mt-1">Quality Grade</label>
            <select
              className="mt-1 block w-full h-12 border-2 border-gray-300 focus:border-green-500 rounded-md px-3"
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value)}
              required
            >
              <option value="">Select Grade</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-m font-medium text-gray-700 mt-1">Amount to Remove</label>
            <input
              type="number"
              className="`mt-1 block w-full h-12 border-2 border-gray-300 focus:outline-none focus:border-green-500 rounded-md px-3"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          <button
            type="submit"
            className="w-full h-12 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200 mt-20"
          >
            Remove Stock
          </button>
        </form>
    </div>
  );
}
