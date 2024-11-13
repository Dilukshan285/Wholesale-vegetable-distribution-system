import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Fix import here
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const CropReadinessList = () => {
  const [notifications, setNotifications] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchDate, setSearchDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('farmerToken');
  let farmerNIC = '';

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      farmerNIC = decodedToken.nic;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      if (farmerNIC) {
        try {
          const response = await axios.get('http://localhost:3001/cropReadiness/notifications', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setNotifications(response.data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, [farmerNIC, token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/cropReadiness/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(notifications.filter((notification) => notification._id !== id));
    } catch (error) {
      alert('Error deleting notification.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/fm_layout/cropReadiness/update/${id}`);
  };

  const filteredNotifications = notifications.filter((notification) => {
    const isDateMatch = searchDate
      ? new Date(notification.preferredPickupDate).toLocaleDateString() ===
        new Date(searchDate).toLocaleDateString()
      : true;
    const isStatusMatch = statusFilter ? notification.status === statusFilter : true;
    return isDateMatch && isStatusMatch;
  });

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  // Function to determine the background color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 border-l-4 border-yellow-500';
      case 'In Progress':
        return 'bg-blue-100 border-l-4 border-blue-500';
      case 'Completed':
        return 'bg-green-100 border-l-4 border-green-500';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Crop Readiness Notifications</h2>
        <button onClick={toggleSearchBar} className="text-gray-700 hover:text-gray-900">
          <FaSearch size={24} />
        </button>
      </div>

      {showSearchBar && (
        <div className="mb-4 flex space-x-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Search by Date:</label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      )}

      {filteredNotifications.length > 0 ? (
        <ul className="space-y-4">
          {filteredNotifications.map((notification) => (
            <li
              key={notification._id}
              className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex justify-between items-start ${getStatusColor(notification.status)}`}
            >
              <div>
                <p className="text-lg font-medium text-gray-700">{notification.cropVariety}</p>
                <p className="text-sm text-gray-600">Quantity: {notification.quantity}</p>
                <p className="text-sm text-gray-600">Expected Quality: {notification.expectedQuality}</p>
                <p className="text-sm text-gray-600">Preferred Pickup Date: {new Date(notification.preferredPickupDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Preferred Pickup Time: {notification.preferredPickupTime}</p>
                <p className="text-sm text-gray-600">Status: {notification.status}</p>
                {notification.attachments.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700">Attachments:</p>
                    <ul className="list-disc list-inside">
                      {notification.attachments.map((attachment, index) => (
                        <li key={index}>
                          <a
                            href={`http://localhost:3001/uploads/${attachment}`} // Adjust this URL based on where files are stored
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {attachment}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(notification._id)}
                  className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(notification._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No notifications available.</p>
      )}
    </div>
  );
};

export default CropReadinessList;
