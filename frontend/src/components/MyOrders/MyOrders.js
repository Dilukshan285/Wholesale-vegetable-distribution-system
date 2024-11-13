import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // To handle navigation

const MyOrders = () => {
  const [orders, setOrders] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // React Router hook for navigation

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/orders/user-list"
        );
        if (response.data && response.data.data) {
          setOrders(response.data.data); // Assuming the response is { success: true, data: [...] }
        } else {
          setOrders([]); // Ensure it's an empty array if the response doesn't contain valid data
        }
      } catch (error) {
        setError("Error fetching orders");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    ); // Confirmation dialog
    console.log("Delete confirmation dialog shown:", confirmDelete); // Log confirmation response
    if (!confirmDelete) return; // Exit if user cancels

    try {
      console.log(`Attempting to delete order with ID: ${orderId}`); // Log the order ID
      await axios.delete(`http://localhost:3001/api/orders/${orderId}`);
      // Remove the deleted order from the orders list
      setOrders(orders.filter((order) => order._id !== orderId));
      // Show toast here for deletion success
      alert("Order deleted successfully!"); // Replace with toast notification if desired
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order"); // Replace with toast notification if desired
    }
  };

  const editOrder = (orderId) => {
    navigate(`/edit-order/${orderId}`);
    console.log(`Edit order with ID: ${orderId}`);
  };

  const viewOrder = (orderId) => {
    // Redirect to order details page
    navigate(`/order-details/${orderId}`);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
        <p className="ml-4 text-xl font-semibold text-green-600">Loading...</p>
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>
      {orders.length > 0 ? (
        <div
          className="overflow-auto rounded-lg mx-auto"
          style={{ maxWidth: "80%" }}
        >
          <table className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
              <tr>
                <th className="py-3 px-4 font-semibold text-left hidden">
                  Order ID
                </th>
                <th className="py-3 px-4 font-semibold text-left hidden">
                  User ID
                </th>
                <th className="py-3 px-4 font-semibold text-left">Amount</th>
                <th className="py-3 px-4 font-semibold text-left">Status</th>
                <th className="py-3 px-4 font-semibold text-left">Payment</th>
                <th className="py-3 px-4 font-semibold text-left">Items</th>
                <th className="py-3 px-4 font-semibold text-left">
                  Shipping Address
                </th>
                <th className="py-3 px-4 font-semibold text-left">
                  Billing Address
                </th>
                <th className="py-3 px-4 font-semibold text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`transition duration-300 ease-in-out ${
                    index % 2 === 0
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4 hidden">{order._id}</td>
                  <td className="py-3 px-4 hidden">{order.userId}</td>

                  {/* Amount Column with Created At */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col items-start text-left">
                      {/* Order Amount */}
                      <span className="text-xl font-semibold text-gray-900">
                        Rs. {order.amount}
                      </span>

                      {/* Order Date */}
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </td>

                  {/* Status Column with Dynamic Styles */}
                  <td className="py-3 px-4 font-medium">
                    <span
                      className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : order.status === "Delivered"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Payment Column */}
                  <td className="py-3 px-4 font-medium">
                    {order.payment ? (
                      <span className="text-green-600 font-semibold">Paid</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Unpaid</span>
                    )}
                  </td>

                  {/* Items Column */}
                  <td className="py-4 px-6">
                    <ul className="list-none space-y-3 ml-0 text-gray-700">
                      {order.items.map((item) => (
                        <li
                          key={item.id}
                          className="text-sm bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between items-center gap-4">
                            {/* Left Section - Thumbnail and Name */}
                            <div className="flex items-center gap-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 bg-gray-200 rounded"
                              />
                              <span className="font-medium text-gray-800">
                                {item.name}
                              </span>
                            </div>

                            {/* Right Section - Quantity and Price */}
                            <div className="flex flex-col items-end text-right">
                              <p className="font-medium text-gray-700">
                                {" "}
                                Rs. {item.price} x {item.qty}{" "}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>

                  {/* Shipping Address Column */}
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <span className="text-gray-700">{order.address.phone}</span>
                    <br />
                    {order.address.street}, {order.address.city},{" "}
                    {order.address.country} - {order.address.postalCode}
                  </td>

                  {/* Billing Address Column */}
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <span className="text-gray-700">
                      {order.billingAddress.phone}
                    </span>{" "}
                    <br />
                    {order.billingAddress.street}, {order.billingAddress.city},{" "}
                    {order.billingAddress.country} -{" "}
                    {order.billingAddress.postalCode}
                  </td>

                  {/* Actions Column */}
                  <td className="py-3 px-4">
                    <div className="flex space-x-4 justify-center">
                      {/* Edit Button */}
                      <button
                        onClick={() => editOrder(order._id)}
                        className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200 ease-in-out"
                      >
                        <i className="fas fa-edit mr-2"></i>Edit
                      </button>

                      {/* Cancel Button */}
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200 ease-in-out"
                      >
                        <i className="fas fa-trash-alt mr-2"></i>Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-lg text-center">No orders found.</p>
      )}
    </div>
  );
};

export default MyOrders;
