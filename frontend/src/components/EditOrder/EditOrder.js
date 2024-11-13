import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditOrder = () => {
  const { orderId } = useParams(); // Get orderId from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/orders/${orderId}`);
        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          setError("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Error fetching order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/orders/list-all-orders/${orderId}`, order);
      alert("Order edited successfully!");
      navigate('/my-orders'); // Redirect to My Orders page
    } catch (error) {
      console.error("Error updating order:", error);
      setError("Error updating order");
    }
  };

  if (loading) return <p className="text-center mt-48">Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Edit Order</h1>
      <form onSubmit={handleSave} className="space-y-6">
        {/* Items */}
        <h3 className="text-xl font-bold text-gray-700 mt-6">Items</h3>
        {order.items.map((item, index) => (
          <div key={index} className="p-4 mb-4 border border-gray-300 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Item Name</label>
                <input
                  type="text"
                  name={`item-name-${index}`}
                  value={item.name}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Quantity</label>
                <input
                  type="number"
                  name={`qty-${index}`}
                  value={item.qty}
                  readOnly // Make read-only to restrict editing
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Price</label>
                <input
                  type="number"
                  name={`price-${index}`}
                  value={item.price}
                  readOnly // Make read-only to restrict editing
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        ))}
        {/* Amount and Status */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Amount</label>
            <input
              type="number"
              name="amount"
              value={order.amount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Status</label>
            <input
              type="text"
              name="status"
              value={order.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div> */}

        {/* Payment */}
        {/* <div>
          <label className="block mb-1 text-gray-700 font-medium">Payment Status</label>
          <select
            name="payment"
            value={order.payment}
            onChange={(e) => setOrder({ ...order, payment: e.target.value === "true" })}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="false">Pending</option>
            <option value="true">Paid</option>
          </select>
        </div> */}

        {/* Shipping Address */}
        <h3 className="text-xl font-bold text-gray-700 mt-6">Shipping Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {['country', 'street', 'city', 'postalCode', 'phone'].map((field) => (
            <div key={field}>
              <label className="block mb-1 text-gray-700 font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="text"
                name={field}
                value={order.address[field]}
                onChange={(e) =>
                  setOrder({
                    ...order,
                    address: { ...order.address, [field]: e.target.value },
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          ))}
        </div>

        {/* Billing Address */}
        <h3 className="text-xl font-bold text-gray-700 mt-6">Billing Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {['country', 'street', 'city', 'postalCode', 'phone'].map((field) => (
            <div key={field}>
              <label className="block mb-1 text-gray-700 font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="text"
                name={field}
                value={order.billingAddress[field]}
                onChange={(e) =>
                  setOrder({
                    ...order,
                    billingAddress: { ...order.billingAddress, [field]: e.target.value },
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          ))}
        </div>

       

        {/* Save Button */}
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-4 hover:bg-green-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditOrder;
