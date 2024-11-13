import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { orderId } = useParams(); // Get orderId from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/orders/${orderId}`);
        setOrder(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!order) {
    return <p>Order not found</p>;
  }

  return (
    <div>
      <h2>Order Details</h2>
      <p>Order ID: {order._id}</p>
      <p>Total Amount: ${order.amount}</p>
      <p>Status: {order.status}</p>
      <h3>Items</h3>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.name} - {item.qty} x ${item.price}
          </li>
        ))}
      </ul>
      <h3>Shipping Address</h3>
      <p>{order.address.street}, {order.address.city}</p>
    </div>
  );
};

export default OrderDetails;
