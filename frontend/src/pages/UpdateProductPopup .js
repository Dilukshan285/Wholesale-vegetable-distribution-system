import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import {
    validateName,
    validateDescription,
    validatePrice,
    validateQuantity,
    validateExpDate,
    validateDiscount,
} from '../Validation/validation.js'; // Import validation functions

const UpdateProductPopup = ({ product, onClose, onUpdate }) => {
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [quantity, setQuantity] = useState(product.quantity);
    const [price, setPrice] = useState(product.price);
    const [discount, setDiscount] = useState(product.discount || 0);
    const [category, setCategory] = useState(product.category || '');
    const [expDate, setExpDate] = useState(product.expDate ? new Date(product.expDate).toISOString().substr(0, 10) : '');
    const [errors, setErrors] = useState({});

    const today = new Date().toISOString().split('T')[0];

    const handleSave = async () => {
        const fieldsToValidate = ['name', 'description', 'price', 'quantity', 'discount', 'expDate'];
        let allValid = true;

        fieldsToValidate.forEach(field => {
            const value = eval(field); // get the value dynamically
            handleValidation(field, value);
            if (errors[field]) allValid = false;
        });

        if (!allValid) {
            toast.error('Please fill all required fields'); // Show error notification
            return; // Prevent the save if validation fails
        }

        try {
            await axios.put(`http://localhost:3001/api/products/update/${product._id}`, {
                name, description, quantity, price, discount, category, expDate
            });
            onUpdate();
            onClose();
        } catch (err) {
            console.error("Error updating product:", err);
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
            default:
                break;
        }
        setErrors(prevErrors => ({ ...prevErrors, [field]: errorMsg }));
    };

    const handleInputChange = (e, field) => {
        const value = e.target.value;

        if (field === 'name' || field === 'description') {
            if (/[^a-zA-Z\s]/.test(value)) return; // Allow only letters and spaces
        }

        // Block non-numeric input for price, quantity, discount
        if (['price', 'quantity', 'discount'].includes(field)) {
            if (/[^0-9.]/.test(value)) return; // Allow only numbers and decimal
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

    // Check if expiration date is expired
    const isExpDateExpired = expDate && expDate < today;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-700">Update Product</h3>

                <label htmlFor="productName" className="block text-lg font-semibold text-gray-600 mb-1 transition-all transform hover:scale-105">Product Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => handleInputChange(e, 'name')}
                    className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter product name"
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}

                <label htmlFor="description" className="block text-lg font-semibold text-gray-600 mb-1 transition-all transform hover:scale-105">Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={e => handleInputChange(e, 'description')}
                    className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter description"
                />
                {errors.description && <p className="text-red-500">{errors.description}</p>}

                <label htmlFor="price" className="block text-lg font-semibold text-gray-600 mb-1 transition-all transform hover:scale-105">Price</label>
                <input
                    type="number"
                    value={price}
                    onChange={e => handleInputChange(e, 'price')}
                    className={`w-full px-4 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter price"
                />
                {errors.price && <p className="text-red-500">{errors.price}</p>}

                <label htmlFor="quantity" className="block text-lg font-semibold text-gray-600 mb-1 transition-all transform hover:scale-105">Quantity</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={e => handleInputChange(e, 'quantity')}
                    className={`w-full px-4 py-2 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter quantity"
                />
                {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}

                <label htmlFor="discount" className="block text-lg font-semibold text-gray-600 mb-1 transition-all transform hover:scale-105">Discount (%)</label>
                <input
                    type="number"
                    value={discount}
                    onChange={e => handleInputChange(e, 'discount')}
                    className={`w-full px-4 py-2 border ${errors.discount ? 'border-red-500' : 'border-gray-300'} rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter discount"
                />
                {errors.discount && <p className="text-red-500">{errors.discount}</p>}

                <label htmlFor="category" className="block text-lg font-semibold text-gray-600 mb-1 transition-all transform hover:scale-105">Category</label>
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Category</option>
                    <option value="carrots">Carrots</option>
                    <option value="leeks">Leeks</option>
                    <option value="potatoes">Potatoes</option>
                    <option value="cabbage">Cabbage</option>
                </select>

                <label htmlFor="expDate" className="block text-lg font-semibold text-gray-600 mb-1 transition-all transform hover:scale-105">Expiration Date</label>
                <input
                    type="date"
                    value={expDate}
                    onChange={e => handleInputChange(e, 'expDate')}
                    className={`w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 ${isExpDateExpired ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500`}
                />
                {errors.expDate && <p className="text-red-500">{errors.expDate}</p>}

                <div className="flex justify-end mt-6">
                <button 
                    onClick={onClose} 
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg mr-3 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave} 
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-sm hover:shadow-md"
                >
                    Save
                </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default UpdateProductPopup;
