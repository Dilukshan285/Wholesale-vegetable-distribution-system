import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import UpdateProductPopup from './UpdateProductPopup ';
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaHome, FaPlus, FaCog, FaTachometerAlt, FaStar } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import logo from '../components/LogoImage.png';

const AdminView = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('http://localhost:3001/api/products/getImages');
            setProducts(res.data);
        } catch (err) {
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (product) => {
        try {
            await axios.delete(`http://localhost:3001/api/products/delete/${product._id}`);
            toast.success('Product deleted successfully');
            fetchProducts(); // Refresh the product list
        } catch (err) {
            setError('Failed to delete product');
            toast.error('Failed to delete product');
        }
    };

    const confirmDelete = (product) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this product?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await handleDelete(product);
            }
        });
    };

    const handleUpdate = (product) => {
        setSelectedProduct(product);
        setIsPopupOpen(true); // Open the popup
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const generatePDF = () => {
        if (!products || products.length === 0) {
            alert('No product data available!');
            return;
        }
    
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to download the PDF?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, download it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const doc = new jsPDF();
    
                // Company Header
                const companyName = 'GSP Traders Pvt Ltd';
                const address = 'A12, Dedicated Economic Centre, Nuwara Eliya, Sri Lanka';
                const email = 'gsptraders29@gmail.com';
                const phone = '+94 77 7144 133';
    
                // Set company details color and font
                doc.setTextColor('#11532F'); // Company green color
                doc.setFontSize(18);
                doc.setFont('helvetica', 'bold');
                doc.text(companyName, 195, 20, { align: 'right' });
    
                const imgData = logo;  // Use the imported logo
                doc.addImage(imgData, 'PNG', 15, 15, 25, 25);
    
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(address, 195, 28, { align: 'right' });
                doc.text(`Email: ${email}`, 195, 34, { align: 'right' });
                doc.text(`Phone: ${phone}`, 195, 40, { align: 'right' });
    
                // Divider
                doc.setDrawColor('#11532F');
                doc.setLineWidth(1);
                doc.line(10, 50, 200, 50);
    
                // Add a title for the report
                doc.setFontSize(16);
                doc.setTextColor(0, 0, 0); // Reset color to black
                doc.setFont('helvetica', 'bold');
                doc.text('Offcut Product Inventory Report', 105, 60, { align: 'center' });
    
                // Section for product details
                doc.setFontSize(14);
                doc.setTextColor('#11532F');
                doc.text('Product Information:', 20, 75);
    
                // Product table
                doc.autoTable({
                    startY: 85,
                    head: [['Product Name', 'Category', 'Quantity', 'Price', 'Discount Percentage', 'Expiry Date']],
                    body: products.map(product => [
                        product.name,
                        product.category,
                        product.quantity,
                        product.price,
                        product.discount,
                        formatDate(product.expDate)
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: '#11532F' },
                    margin: { left: 20, right: 20 },
                });
    
                // Divider for separation
                doc.setDrawColor('#11532F');
                doc.setLineWidth(0.5);
                doc.line(10, doc.lastAutoTable.finalY + 20, 200, doc.lastAutoTable.finalY + 20);
    
                // Footer
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.setFont('helvetica', 'normal');
                doc.text('Generated on: ' + new Date().toLocaleDateString(), 105, doc.lastAutoTable.finalY + 30, { align: 'center' });
    
                // Save the PDF
                doc.save('Product_Inventory_Report.pdf');
    
                Swal.fire('Downloaded!', 'Your PDF has been generated and downloaded.', 'success');
            }
        });
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
                <Link to='/qa-manager/qa-records' className="flex items-center space-x-3 hover:bg-green-700 p-2 rounded">
                    <FaStar className="text-3xl" />
                    <span className="text-xl">C Grades</span>
                </Link>
            </div>
        </div>
    );

    
    const sortedProducts = products.sort((a, b) => new Date(a.expDate) - new Date(b.expDate));

    return (
        <div>
            <Sidebar />
            <div>
                <br />
                <div className="flex-1 p-8 bg-green-100 shadow-lg rounded-[15px] ml-64">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-bold text-black mt-4 p-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg shadow-lg drop-shadow-lg">
                            Offcut Inventory
                        </h2>
                        <div className="flex space-x-4">
                            <Link to="/add-product" className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                                Add Product
                            </Link>
                            <button 
                                onClick={generatePDF}
                                className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                Export PDF
                            </button>
                        </div>
                    </div>
                    {loading ? (
                        <div className="text-center font-bold">Loading...</div>
                    ) : error ? (
                        <div className="text-red-600 text-center">{error}</div>
                    ) : (
                        <div className="overflow-x-auto rounded-[15px]">
                            <table id="product-table" className="min-w-full text-left">
                                <thead className="bg-green-500 text-gray-700 text-lg">
                                    <tr>
                                        <th className="py-3 px-6 border-b">Image</th>
                                        <th className="py-3 px-6 border-b">Name</th>
                                        <th className="py-3 px-6 border-b">Category</th>
                                        <th className="py-3 px-6 border-b">Price</th>
                                        <th className="py-3 px-6 border-b">Discount</th>
                                        <th className="py-3 px-6 border-b">Quantity(kg)</th>
                                        <th className="py-3 px-6 border-b">Expiration Date</th>
                                        <th className="py-3 px-6 border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-base">
                                    {sortedProducts.map(product => {
                                        const expirationDate = new Date(product.expDate);
                                        const today = new Date();
                                        const isExpiringSoon = expirationDate.toDateString() === today.toDateString() || 
                                            expirationDate.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString() ||
                                            expirationDate.toDateString() === new Date(today.setDate(today.getDate() + 1)).toDateString();

                                        return (
                                            <tr key={product._id} className="border-b hover:bg-green-50 transition duration-200 hover:shadow-lg">
                                                <td className="py-4 px-6">
                                                    <img 
                                                        src={`http://localhost:3001/Images/${product.image}`} 
                                                        alt={product.name} 
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                        loading="lazy"
                                                    />
                                                </td>
                                                <td className="py-4 px-6 font-medium text-gray-900">{product.name}</td>
                                                <td className="py-4 px-6 text-gray-500">{product.category}</td>
                                                <td className="py-4 px-6 text-gray-900">Rs.{product.price}</td>
                                                <td className="py-4 px-6 text-gray-500">{product.discount}%</td>
                                                <td className="py-4 px-6 text-gray-500">{product.quantity}</td>
                                                
                                                
                                                <td className={`py-4 px-6 ${isExpiringSoon ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                                                    {formatDate(product.expDate)}
                                                </td>
                                            
                                                <td className="py-4 px-6">
                                                    <div className="flex space-x-4">
                                                        <button 
                                                            onClick={() => handleUpdate(product)}
                                                            className="flex items-center justify-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                                                        >
                                                            <FaEdit size={20} />
                                                        </button>
                                                        <button 
                                                            onClick={() => confirmDelete(product)}
                                                            className="flex items-center justify-center bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                                                        >
                                                            <FaTrash size={20} />
                                                        </button>
                                                    </div>
                                                    
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Update Product Popup */}
                {isPopupOpen && (
                    <UpdateProductPopup 
                        product={selectedProduct} 
                        onClose={() => setIsPopupOpen(false)} 
                        onUpdate={fetchProducts}
                    />
                )}

            </div>

            {/* Toast Notifications */}
            <ToastContainer 
                position="top-center" 
                autoClose={3000} 
                hideProgressBar={false} 
                closeOnClick 
                draggable 
                pauseOnHover 
                theme="light" 
            />
        </div>
    );
};

export default AdminView;
