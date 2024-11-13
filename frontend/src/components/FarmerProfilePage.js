import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FarmerProfilePage = () => {
    const [farmer, setFarmer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        const fetchFarmerProfile = async () => {
            try {
                const token = localStorage.getItem('farmerToken');
                if (!token) throw new Error('No authentication token found. Please log in.');

                const response = await axios.get('http://localhost:3001/farmer/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setFarmer(response.data);
            } catch (err) {
                setError('Error fetching farmer profile');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFarmerProfile();
    }, []);

    const handleEdit = () => {
        navigate('/edit-profile'); // Adjust the path as per your routing setup
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-6">{error}</div>;

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">My Profile</h2>

                <table className="table-auto w-full border-collapse border border-gray-300">
                    <tbody>
                        {[
                            { label: 'First Name', value: farmer.firstName },
                            { label: 'Last Name', value: farmer.lastName },
                            { label: 'Date of Birth', value: new Date(farmer.DOB).toLocaleDateString() },
                            { label: 'Age', value: farmer.age },
                            { label: 'Gender', value: farmer.gender },
                            { label: 'NIC', value: farmer.NIC },
                            { label: 'Address', value: farmer.address },
                            { label: 'Email', value: farmer.email },
                            { label: 'Contact', value: farmer.contact },
                        ].map((item, index) => (
                            <tr key={index} className="even:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">{item.label}</td>
                                <td className="border border-gray-300 px-4 py-2 text-gray-900">{item.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                
            </div>
        </div>
    );
};

export default FarmerProfilePage;
