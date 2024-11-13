import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const PickupRequestChart = () => {
  const [pickupRequestData, setPickupRequestData] = useState([]);

  useEffect(() => {
    // Fetch data from your API (replace with your actual endpoint)
    axios
      .get('http://localhost:3001/pickup-request/all-pickup-requests')
      .then((res) => {
        const requests = res.data;
        const formattedData = processData(requests);
        setPickupRequestData(formattedData);
      })
      .catch((err) => {
        console.error('Error fetching pickup requests data:', err);
      });
  }, []);

  const processData = (data) => {
    const farmerRequests = {};

    data.forEach((request) => {
      const farmerNIC = request.NIC;

      if (!farmerRequests[farmerNIC]) {
        farmerRequests[farmerNIC] = { NIC: farmerNIC, Completed: 0, Pending: 0, InProgress: 0 };
      }

      switch (request.status) {
        case 'Completed':
          farmerRequests[farmerNIC].Completed += 1;
          break;
        case 'Pending':
          farmerRequests[farmerNIC].Pending += 1;
          break;
        case 'In Progress':
          farmerRequests[farmerNIC].InProgress += 1;
          break;
        default:
          break;
      }
    });

    // Convert object to array for chart
    return Object.values(farmerRequests);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Pickup Requests</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={pickupRequestData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="NIC" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Completed" fill="#4caf50" />
          <Bar dataKey="Pending" fill="#ff9800" />
          <Bar dataKey="InProgress" fill="#2196f3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PickupRequestChart;
