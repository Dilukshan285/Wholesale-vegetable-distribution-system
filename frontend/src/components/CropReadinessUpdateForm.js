import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CropReadinessUpdateForm = ({ notificationId }) => {
    const [formData, setFormData] = useState({
        farmerNIC: '',
        cropVariety: '',
        quantity: '',
        expectedQuality: '',
        preferredPickupDate: '',
        preferredPickupTime: '',
        attachments: [],
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Helper function for NIC validation
    const validateNIC = (nic) => {
        const nicRegex9 = /^[0-9]{9}[vVxX]$/; // 9 numbers followed by V or X
        const nicRegex12 = /^[0-9]{12}$/; // 12 numbers
        return nicRegex9.test(nic) || nicRegex12.test(nic);
    };

    // Restrict quantity to numbers and period only
    const handleQuantityChange = (e) => {
        const { name, value } = e.target;
        if (/^[1-9.]*$/.test(value)) {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    // Fetch crop readiness notification by ID
    const fetchNotification = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('farmerToken');
            if (!token) throw new Error('No authentication token found. Please log in.');

            const response = await axios.get(`http://localhost:3001/cropReadiness/${notificationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;
            if (data) {
                const formattedDate = new Date(data.preferredPickupDate).toISOString().split('T')[0];
                setFormData({
                    farmerNIC: data.farmerNIC || '',
                    cropVariety: data.cropVariety || '',
                    quantity: data.quantity || '',
                    expectedQuality: data.expectedQuality || '',
                    preferredPickupDate: formattedDate || '',
                    preferredPickupTime: data.preferredPickupTime || '',
                    attachments: [],
                });
            } else {
                setError('No data found for this notification.');
            }
        } catch (err) {
            setError('Error fetching notification details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (notificationId) {
            fetchNotification();
        }
    }, [notificationId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        // Validate inputs on change
        validateField(name, value);
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({ ...prevData, attachments: [...e.target.files] }));
    };

    const validateField = (name, value) => {
        let errorMsg = "";
    
        switch (name) {
          case "farmerNIC":
            if (!/^\d{9}[Vv]$|^\d{12}$/.test(value)) {
              errorMsg =
                'NIC must be either 9 digits followed by "V" or 12 digits.';
            }
            break;
          case "quantity":
            if (!/^\d*\.?\d*$/.test(value)) {
              errorMsg = "Only numbers and periods are allowed in the quantity.";
            } else if (parseFloat(value) <= 0) {
              errorMsg = "Quantity must be greater than 0.";
            }
            break;
          case "preferredPickupDate":
            const today = new Date();
            const selectedDate = new Date(value);
            const maxDate = new Date();
            maxDate.setDate(today.getDate() + 10); // Add 10 days to today's date
    
            if (selectedDate < today.setHours(0, 0, 0, 0)) {
              errorMsg = "You cannot select a past date.";
            } else if (selectedDate > maxDate) {
              errorMsg = "Pickup date must be within the next 10 days.";
            }
            break;
          case "preferredPickupTime":
            const pickupTime = new Date(`1970-01-01T${value}:00`); // Assume value is in "HH:MM" format
            const minTime = new Date("1970-01-01T02:00:00"); // 2:00 AM
            const maxTime = new Date("1970-01-01T12:00:00"); // 12:00 PM
            
            if (pickupTime < minTime || pickupTime > maxTime) {
              errorMsg = "Pickup time must be between 2:00 AM and 12:00 PM.";
            }
            break;
          default:
            if (!value) {
              errorMsg = `${name} cannot be empty.`;
            }
            break;
        }
    
        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for any errors before submitting
        const formErrors = {};
        Object.keys(formData).forEach((key) => {
            if (!formData[key] && key !== 'attachments') {
                formErrors[key] = 'This field is required.';
            }
        });

        setErrors(formErrors);
        if (Object.keys(formErrors).length > 0) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('farmerToken');
            if (!token) throw new Error('No authentication token found. Please log in.');

            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((file) => formDataToSend.append('attachments', file));
                } else {
                    formDataToSend.append(key, value);
                }
            });

            await axios.put(`http://localhost:3001/cropReadiness/${notificationId}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Crop readiness updated successfully!');
            navigate('/fm_layout/cropReadiness'); // Redirect after successful update
        } catch (error) {
            setError('Error updating crop readiness.');
            console.error(error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Update Crop Readiness</h2>
            
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="mb-4">
                <label htmlFor="farmerNIC" className="block text-sm font-medium text-gray-700 mb-2">
                    Farmer NIC
                </label>
                <input
                    type="text"
                    name="farmerNIC"
                    id="farmerNIC"
                    value={formData.farmerNIC}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded p-2 w-full"
                />
                {errors.farmerNIC && <p className="text-red-500 text-sm">{errors.farmerNIC}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="cropVariety" className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Variety
                </label>
                <select
                    name="cropVariety"
                    id="cropVariety"
                    value={formData.cropVariety}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded p-2 w-full"
                >
                    <option value="">Select Crop Variety</option>
                    <option value="Carrot">Carrot</option>
                    <option value="Cabbage">Cabbage</option>
                    <option value="Leek">Leek</option>
                    <option value="Potato">Potato</option>
                </select>
                {errors.cropVariety && <p className="text-red-500 text-sm">{errors.cropVariety}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                </label>
                <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    value={formData.quantity}
                    onChange={handleQuantityChange}
                    required
                    className="border border-gray-300 rounded p-2 w-full"
                />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="expectedQuality" className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Quality
                </label>
                <select
                    name="expectedQuality"
                    id="expectedQuality"
                    value={formData.expectedQuality}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded p-2 w-full"
                >
                    <option value="">Select Quality</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                {errors.expectedQuality && <p className="text-red-500 text-sm">{errors.expectedQuality}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="preferredPickupDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Pickup Date
                </label>
                <input
  type="date"
  name="preferredPickupDate"
  id="preferredPickupDate"
  value={formData.preferredPickupDate}
  onChange={handleChange}
  required
  className="border border-gray-300 rounded p-2 w-full"
  min={new Date().toISOString().split('T')[0]} // Disable past dates
  max={new Date(new Date().setDate(new Date().getDate() + 10))
    .toISOString()
    .split('T')[0]} // Restrict to next 10 days
/>

                {errors.preferredPickupDate && <p className="text-red-500 text-sm">{errors.preferredPickupDate}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="preferredPickupTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Pickup Time
                </label>
                <input
                    type="time"
                    name="preferredPickupTime"
                    id="preferredPickupTime"
                    value={formData.preferredPickupTime}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded p-2 w-full"
                />
                {errors.preferredPickupTime && <p className="text-red-500 text-sm">{errors.preferredPickupTime}</p>}
            </div>
            

            <div className="mb-4">
                <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments
                </label>
                <input
                    type="file"
                    name="attachments"
                    id="attachments"
                    multiple
                    onChange={handleFileChange}
                    className="border border-gray-300 rounded p-2 w-full"
                />
            </div>

            <div className="mt-4">
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 w-full"
                    disabled={loading}
                >
                    Update Crop Readiness
                </button>
            </div>
        </form>
    );
};

export default CropReadinessUpdateForm;
