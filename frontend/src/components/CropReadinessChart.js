import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CropReadinessChart = ({ statusCounts }) => {
  // Convert status counts into data for the Pie chart
  const data = [
    { name: 'Pending', value: statusCounts.Pending },
    { name: 'In Progress', value: statusCounts.InProgress },
    { name: 'Completed', value: statusCounts.Completed }
  ];

  const COLORS = ['#FFBB28', '#0088FE', '#00C49F'];

  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Crop Readiness by Status</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CropReadinessChart;
