import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaQrcode, FaTimes } from "react-icons/fa"; 

const ViewProduct = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(false);
    const [qrCode, setQrCode] = useState(""); 
    const [isModalOpen, setIsModalOpen] = useState(false); 

    // Fetch products from the API
    useEffect(() => {
        axios.get('http://localhost:3001/api/products/getImages')
            .then(res => {
                setProducts(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    // Handle category and search filtering
    const handleFilter = (product) => {
        return (selectedCategory === "All" || product.category === selectedCategory) &&
               product.name.toLowerCase().includes(searchQuery.toLowerCase());
    };

    // Helper function to calculate discounted price
    const calculateDiscountedPrice = (price, discount) => {
        return (price - (price * (discount / 100))).toFixed(2);
    };

    // Handle QR Code button click
    const handleQrClick = (qrCodeUrl) => {
        setQrCode(qrCodeUrl); 
        setIsModalOpen(true); 
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Sidebar Component

    return (
        <div className="flex">
            <div className="ml-35 p-10 w-full">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border border-green-500 bg-white text-gray-700 px-4 py-3 pr-10 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 hover:shadow-lg transition duration-300 ease-in-out mb-4 md:mb-0 relative appearance-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E")`,
                            backgroundPosition: 'right 0.75rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.25rem',
                        }}
                    >
                        <option value="All">All Categories</option>
                        <option value="Carrots">Carrots</option>
                        <option value="Potatoes">Potatoes</option>
                        <option value="Leeks">Leeks</option>
                        <option value="Cabbage">Cabbage</option>
                    </select>
                    {/* Search Bar */}
                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full border border-gray-300 pl-12 pr-4 py-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 hover:shadow-lg transition duration-100 ease-in-out"
                        />
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                {/* Loader */}
                {loading && (
                    <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-300"></div>
                    </div>
                )}

                {/* Product Grid */}
                <h1 className="text-5xl font-extrabold text-center text-gray-600 my-6 drop-shadow-lg transition-transform transform hover:scale-105">
                    Offcut Specials
                </h1>
                <br></br>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {products.filter(handleFilter).map((product) => (
                        <div 
                            key={product._id} 
                            className="border border-gray-200 rounded-lg shadow-lg p-4 bg-white transform transition duration-300 hover:scale-105 max-w-xs mx-auto"
                        >
                            {/* Product Image */}
                            <div className="h-48 flex justify-center items-center">
                                <img
                                    src={`http://localhost:3001/Images/${product.image}`}
                                    alt={product.name}
                                    className="object-cover h-full w-full rounded-[15px]"
                                />
                            </div>

                            {/* Product Name */}
                            <h3 className="text-gray-800 text-lg font-semibold mt-4">
                                {product.name}
                            </h3>

                            {/* Product Category */}
                            <p className="text-gray-500 text-sm">
                                {product.category}
                            </p>

                            {/* Price and Discount Section */}
                            <div className="mt-2">
                                {product.discount > 0 ? (
                                    <>
                                        <span className="line-through text-gray-400 mr-2">Rs.{product.price.toFixed(2)}</span>
                                        <span className="text-green-600 font-bold text-lg">
                                            <br></br>
                                            Rs.{calculateDiscountedPrice(product.price, product.discount)}
                                        </span>
                                        <span className="ml-2 text-red-500 font-semibold">
                                            (-{product.discount}%)
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-green-600 font-bold text-lg">Rs.{product.price.toFixed(2)}</span>
                                )}
                            </div>

                            <div className="flex items-center mt-4 justify-between">
                            <input
                                type="number"
                                min="1"
                                defaultValue="1"
                                className="border w-12 p-1 text-center rounded-md mr-2"
                            />
                            <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition duration-200 mr-2">
                                Add to Cart
                            </button>
                            {/* QR Code Button */}
                            <button 
                                className="bg-blue-500 text-white px-2 py-2 rounded-md shadow hover:bg-blue-600 transition duration-200"
                                onClick={() => handleQrClick(product.qrCode)} // Pass QR code URL
                            >
                                <FaQrcode className="text-lg" /> {/* Only the icon */}
                            </button>
                        </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for QR Code */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">QR Code</h2>
                        {qrCode && <img src={qrCode} alt="QR Code" className="w-64 h-64 mb-4" />}
                        <p className='text-center mt-[-5px] text-sm'>View product details</p>
                        <button 
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            onClick={closeModal}
                        >
                            <FaTimes className="inline mr-1" /> Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewProduct;
