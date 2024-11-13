import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StockBarChart = ({ totalQuantities }) => {
  // Prepare data for the chart
  const labels = Object.keys(totalQuantities); // Vegetable types
  const datasets = ['A', 'B', 'C'].map((grade) => ({
    label: `Quality Grade ${grade}`,
    data: labels.map(vegType => totalQuantities[vegType][grade] || 0),
    backgroundColor: grade === 'A' ? '#399918' :
                     grade === 'B' ? '#FABC3F' :
                     '#C7253E',
  }));

  const data = {
    labels,
    datasets,
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Quantity (kg)',
        },
      },
    },
  };

  return (
    <div className="my-6">
      <Bar data={data} options={options} />
    </div>
  );
};

export default StockBarChart;
