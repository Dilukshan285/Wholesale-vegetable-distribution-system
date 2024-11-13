import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PickupRequestList = ({ setTotalRequests }) => {
  const [pickupRequests, setPickupRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state for search, filter, pagination
  const [searchDate, setSearchDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;  // Number of requests to show per page

  const farmerToken = localStorage.getItem('farmerToken');

  let farmerNIC = null;
  if (farmerToken) {
    try {
      const decoded = jwtDecode(farmerToken);
      farmerNIC = decoded.nic;
    } catch (err) {
      console.error('Failed to decode token:', err);
      setError('Invalid token. Please login again.');
    }
  }

  useEffect(() => {
    if (farmerNIC) {
      axios
        .get(`http://localhost:3001/pickup-request/pickupRequests`, {
          headers: {
            Authorization: `Bearer ${farmerToken}`,
          },
        })
        .then((response) => {
          setPickupRequests(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching pickup requests:', err);
          setError('Failed to load pickup requests.');
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError('Unable to identify the farmer. Please login again.');
    }
  }, [farmerNIC, farmerToken, setTotalRequests]);

  // Filter pickup requests based on searchDate and statusFilter
  const filteredPickupRequests = pickupRequests.filter((request) => {
    const isDateMatch = searchDate
      ? new Date(request.preferredDate).toLocaleDateString() === new Date(searchDate).toLocaleDateString()
      : true;
    const isStatusMatch = statusFilter ? request.status === statusFilter : true;
    return isDateMatch && isStatusMatch;
  });

  // Get current requests for the current page
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredPickupRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="text-center mt-5 text-lg">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-5 text-red-600">{error}</div>;
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this request?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3001/pickup-request/${id}`);
      setPickupRequests(pickupRequests.filter((request) => request._id !== id));
      alert('Pickup request deleted successfully.');
    } catch (error) {
      console.error('Error deleting pickup request:', error);
      alert('Failed to delete pickup request.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Pickup Requests</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <div>
          <label className="text-gray-700 font-semibold">Search by Preferred Date: </label>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="ml-2 px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="text-gray-700 font-semibold">Filter by Status: </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ml-2 px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
      </div>

      {currentRequests.length === 0 ? (
        <p className="text-lg text-gray-600">No pickup requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-700 text-white uppercase text-sm leading-normal">
                <th className="py-4 px-6 text-left font-semibold">Crop Types</th>
                <th className="py-4 px-6 text-left font-semibold">Quantities</th>
                <th className="py-4 px-6 text-left font-semibold">Preferred Date</th>
                <th className="py-4 px-6 text-left font-semibold">Preferred Time</th>
                <th className="py-4 px-6 text-left font-semibold">Address</th>
                <th className="py-4 px-6 text-left font-semibold">Status</th>
                <th className="py-4 px-6 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {currentRequests.map((request) => (
                <tr key={request._id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-200">
                  <td className="py-4 px-6 whitespace-nowrap" style={{ whiteSpace: 'pre-line' }}>
                    {request.crops.map((crop) => crop.cropType).join('\n')}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap" style={{ whiteSpace: 'pre-line' }}>
                    {request.crops.map((crop) => crop.quantity).join('\n')}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {new Date(request.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">{request.preferredTime}</td>
                  <td className="py-4 px-6 whitespace-nowrap">{request.address}</td>
                  <td className="py-4 px-6 whitespace-nowrap">{request.status || 'Pending'}</td>
                  <td className="py-4 px-6 whitespace-nowrap flex items-center space-x-2">
                    <Link to={`/fm_layout/update-pickup-request/${request._id}`}>
                      <button className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition duration-200">
                        Edit
                      </button>
                    </Link>
                    <button
                      className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition duration-200"
                      onClick={() => handleDelete(request._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <ul className="flex space-x-2">
          {[...Array(Math.ceil(filteredPickupRequests.length / requestsPerPage)).keys()].map(number => (
            <li key={number} className="cursor-pointer">
              <button
                onClick={() => paginate(number + 1)}
                className={`px-4 py-2 border rounded-lg ${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              >
                {number + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PickupRequestList;
