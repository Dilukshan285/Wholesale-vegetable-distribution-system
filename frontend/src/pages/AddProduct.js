import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaImage, FaSpinner } from 'react-icons/fa';
import { FaHome, FaPlus, FaCog, FaTachometerAlt, FaStar } from "react-icons/fa"; 
import QRCode from 'qrcode';
import { toast,ToastContainer } from 'react-toastify'; 
import {
  validateName,
  validateDescription,
  validatePrice,
  validateQuantity,
  validateExpDate,
  validateDiscount,
  validateFile
} from '../Validation/validation.js'; // Import validation functions

const AddProduct = () => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [category, setCategory] = useState('All Categories');
    const [description, setDescription] = useState('');
    const [expDate, setExpDate] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    // Get the current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const handleUpload = async () => {
        const fieldsToValidate = ['name', 'description', 'price', 'quantity', 'discount', 'expDate', 'file'];
        let allValid = true;
    
        fieldsToValidate.forEach(field => {
            const value = field === 'file' ? file : eval(field); // get the value dynamically
            handleValidation(field, value);
            if (errors[field]) allValid = false;
        });
    
        // Trigger toast error if any field is invalid
    if (!allValid) {
        toast.error('Please fill all required fields'); // Show error notification
        return; // Prevent the upload if validation fails
    }
    
        // Proceed with the upload logic if all fields are valid
        try {
            const qrData = `Name: ${name}\nDescription: ${description}\nPrice: ${price}\nQuantity: ${quantity}\nDiscount: ${discount}\nExpiry Date: ${expDate}\nCategory: ${category}`;
            const qrCodeUrl = await QRCode.toDataURL(qrData); 
    
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('quantity', quantity);
            formData.append('price', price);
            formData.append('discount', discount);
            formData.append('category', category);
            formData.append('expDate', expDate);
            formData.append('qrCode', qrCodeUrl); 
    
            axios.post('http://localhost:3001/api/products/upload', formData)
                .then(res => {
                    console.log('Upload response:', res.data);
                    navigate('/admin-product');
                    window.location.reload();
                })
                .catch(err => console.log(err));
        } catch (error) {
            console.error('Error generating PDF or uploading product:', error);
        }
    };

    const handleValidation = (field, value) => {
        let errorMsg = '';
        switch (field) {
            case 'name':
                errorMsg = validateName(value);
                break;
            case 'description':
                errorMsg = validateDescription(value);
                break;
            case 'price':
                errorMsg = validatePrice(value);
                break;
            case 'quantity':
                errorMsg = validateQuantity(value);
                break;
            case 'expDate':
                errorMsg = validateExpDate(value);
                break;
            case 'discount':
                errorMsg = validateDiscount(value);
                break;
            case 'file':
                errorMsg = validateFile(value);
                break;
            default:
                break;
        }
        setErrors(prevErrors => ({ ...prevErrors, [field]: errorMsg }));
    };

    const handleInputChange = (e, field) => {
        const value = e.target.value;

        if (field === 'name' || field === 'description') {
            if (/[^a-zA-Z\s,-.]/.test(value)) return; // Allow only letters and spaces
        }

        // Block non-numeric input for price, quantity, discount
        if (['price', 'quantity', 'discount'].includes(field)) {
            if (/[^0-9.]/.test(value)) return; // Allow only numbers and decimal
        }
        if (field === 'expDate') {
            const selectedDate = new Date(value);
            const currentDate = new Date(today);
        
        const expDateField = document.querySelector('input[type="date"]');
        if (selectedDate < currentDate) {
        expDateField.classList.add('blur-sm', 'pointer-events-none', 'opacity-50');
        } else {
        expDateField.classList.remove('blurred-date');
        }
    }

        switch (field) {
            case 'name':
                setName(value);
                break;
            case 'description':
                setDescription(value);
                break;
            case 'price':
                setPrice(value);
                break;
            case 'quantity':
                setQuantity(value);
                break;
            case 'discount':
                setDiscount(value);
                break;
            case 'expDate':
                setExpDate(value);
                break;
            default:
                break;
        }

        handleValidation(field, value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);

        handleValidation('file', selectedFile);
    };


    // Sidebar Component
    const Sidebar = () => (
        <div className="w-64 h-screen bg-green-800 text-white p-4 fixed flex flex-col justify-between">
            <div className="space-y-6">
                <br></br>
                <br></br>
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
        </div>
    );

    return (
        <div>
            <Sidebar/>
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="max-w-6xl mx-auto p-8 bg-white shadow-md rounded-lg border border-green-300">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">Add New Offcut Vegetable</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-green-700">General Information</h3>
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={name}
                                onChange={(e) => handleInputChange(e, 'name')}
                                className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-green-300'} rounded-lg`}
                            />
                            {errors.name && <p className="text-red-500">{errors.name}</p>}

                            <textarea
                                placeholder="Product Description"
                                value={description}
                                onChange={(e) => handleInputChange(e, 'description')}
                                className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-green-300'} rounded-lg`}
                            />
                            {errors.description && <p className="text-red-500">{errors.description}</p>}

                            <div className="relative">
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-green-300 rounded-lg appearance-none"
                                >
                                    <option value="All Categories">All Categories</option>
                                    <option value="Carrots">Carrots</option>
                                    <option value="Cabbage">Cabbage</option>
                                    <option value="Leeks">Leeks</option>
                                    <option value="Potatoes">Potatoes</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-green-700">Pricing and Stock</h3>
                            <input
                                type="text"
                                placeholder="Base Price"
                                value={price}
                                onChange={(e) => handleInputChange(e, 'price')}
                                className={`w-full px-4 py-2 border ${errors.price ? 'border-red-500' : 'border-green-300'} rounded-lg`}
                            />
                            {errors.price && <p className="text-red-500">{errors.price}</p>}

                            <input
                                type="number"
                                placeholder="Stock"
                                value={quantity}
                                onChange={(e) => handleInputChange(e, 'quantity')}
                                className={`w-full px-4 py-2 border ${errors.quantity ? 'border-red-500' : 'border-green-300'} rounded-lg`}
                            />
                            {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-green-700">Expiration Date & Image</h3>
                            <input
                                type="date" 
                                value={expDate}
                                min={today} // Set the minimum date to today to disable past dates
                                onChange={(e) => handleInputChange(e, 'expDate')}
                                className={`w-full px-4 py-2 border ${errors.expDate ? 'border-red-500' : 'border-green-300'} rounded-lg`}
                            />
                            {errors.expDate && <p className="text-red-500">{errors.expDate}</p>}

                            <label className="bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center font-bold max-w-xs">
                                <FaImage className="mr-2" /> Choose File
                                <input type="file" onChange={handleFileChange} className="hidden" />
                            </label>
                            {errors.file && <p className="text-red-500">{errors.file}</p>}

                            <div className="w-full h-48 bg-gray-100 border rounded-lg flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <span className="flex flex-col items-center space-y-2">
                                        <FaSpinner className="animate-spin-once text-3xl text-green-600" />
                                        <span className="text-gray-600 font-semibold">Upload Image</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-green-700">Discount</h3>
                            <input
                                type="text"
                                placeholder="Discount"
                                value={discount}
                                onChange={(e) => handleInputChange(e, 'discount')}
                                className={`w-full px-4 py-2 border ${errors.discount ? 'border-red-500' : 'border-green-300'} rounded-lg`}
                            />
                            {errors.discount && <p className="text-red-500">{errors.discount}</p>}
                        </div>

                        <div className="flex justify-center mt-4">
                            <button
                                onClick={handleUpload}
                                className="px-11 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-lg hover:from-green-500 hover:to-green-600 transform hover:scale-105 transition-transform duration-300 ease-in-out"
                            >
                                Upload Product
                            </button>
                        </div>
                        <ToastContainer 
                        position="bottom-center" 
                        autoClose={3000} 
                        hideProgressBar={false} 
                        closeOnClick 
                        draggable 
                        pauseOnHover 
                        theme="light" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
