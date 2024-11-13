import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';
import { FaHome, FaPlus, FaCog, FaTachometerAlt, FaStar } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Sidebar Component
const Sidebar = () => {
    return (
        <div className="w-64 h-screen bg-green-800 text-white p-4 fixed flex flex-col justify-between">
            <div className="space-y-6">
                <br /><br />
                <Link to='/view-product' className="flex items-center space-x-3 hover:bg-green-700 p-2 rounded">
                    <FaHome className="text-3xl" />
                    <span className="text-xl">Home</span>
                </Link>
                <Link to='/add-product' className="flex items-center space-x-3 hover:bg-green-700 p-2 rounded">
                    <FaPlus className="text-3xl" />
                    <span className="text-xl">Add Product</span>
                </Link>
                <Link to='/admin-product' className="flex items-center space-x-3 hover:bg-green-700 p-2 rounded">
                    <FaCog className="text-3xl" />
                    <span className="text-xl">Manage Product</span>
                </Link>
                <Link to='/offcut-dashboard' className="flex items-center space-x-3 hover:bg-green-700 p-2 rounded">
                    <FaTachometerAlt className="text-3xl" />
                    <span className="text-xl">Dashboard</span>
                </Link>
                <Link to='/c-grades' className="flex items-center space-x-3 hover:bg-green-700 p-2 rounded">
                    <FaStar className="text-3xl" />
                    <span className="text-xl">C Grades</span>
                </Link>
            </div>
            <button className="w-full bg-pink-500 text-white text-xl px-4 py-2 rounded-md hover:bg-pink-600">
                Logout
            </button>
        </div>
    );
};

const Dashboard = () => {
    const [categoriesData, setCategoriesData] = useState({});

    // Fetch products data
    useEffect(() => {
        axios.get('http://localhost:3001/api/products/getImages')
            .then(res => {
                const categories = {};

                res.data.forEach(product => {
                    const category = product.category;
                    if (!categories[category]) {
                        categories[category] = { names: [], quantities: [] };
                    }
                    const index = categories[category].names.indexOf(product.name);
                    if (index === -1) {
                        categories[category].names.push(product.name);
                        categories[category].quantities.push(product.quantity);
                    } else {
                        categories[category].quantities[index] += product.quantity;
                    }
                });

                setCategoriesData(categories);
            })
            .catch(err => console.log(err));
    }, []);

    // Prepare chart data for each category
    const charts = Object.keys(categoriesData).map(category => {
        const { names, quantities } = categoriesData[category];

        const barData = {
            labels: names,
            datasets: [
                {
                    label: 'Product Quantity',
                    data: quantities,
                    backgroundColor: '#4CAF50', // Green
                },
            ],
        };

        return (
            <div key={category} className="my-6">
                <div className="bg-white p-4 rounded-lg shadow-lg h-80 border border-blue-900">
                    <h3 className="text-lg font-semibold mb-4 text-gray-600">{category} - Product Quantities</h3>
                    <Bar 
                        data={barData} 
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(tooltipItem) {
                                            return tooltipItem.label + ': ' + tooltipItem.raw;
                                        }
                                    }
                                }
                            },
                            layout: {
                                padding: 20,
                            }
                        }} 
                        height={300} 
                    />
                </div>
            </div>
        );
    });

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-grow p-6 ml-64"> 
                <h2 className="text-2xl font-bold mb-6 text-gray-600">Dashboard</h2>
                {charts}
            </div>
        </div>
    );
};

export default Dashboard;
