import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ title, statusCounts }) => {
    if (!statusCounts) {
        return <div>Loading chart data...</div>;
    }

    const data = {
        labels: ['Pending', 'In Progress', 'Completed'],
        datasets: [
            {
                data: [
                    statusCounts.Pending || 0,
                    statusCounts.InProgress || 0,
                    statusCounts.Completed || 0
                ],
                backgroundColor: ['#f39c12', '#3498db', '#2ecc71'],
                hoverBackgroundColor: ['#f1c40f', '#2980b9', '#27ae60']
            }
        ]
    };

    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">{title}</h2>
            <Pie data={data} />
        </div>
    );
};

export default PieChart;
