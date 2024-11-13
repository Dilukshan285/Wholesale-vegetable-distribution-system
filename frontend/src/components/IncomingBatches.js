import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IncomingBatches = ({ userRole }) => {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState('');
  const [fadeIn, setFadeIn] = useState(false); 
  const navigate = useNavigate(); 

  // Fetch incoming batches when the component mounts
  useEffect(() => {
    fetch('http://localhost:3001/incomingBatches')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Sort batches by arrivalDate in ascending order (oldest first)
        const sortedBatches = data.sort((a, b) => new Date(a.arrivalDate) - new Date(b.arrivalDate));
        setBatches(sortedBatches);
        setFadeIn(true); // Set fade-in to true after data is fetched and sorted
      })
      .catch((err) => {
        setError('Error fetching incoming batches: ' + err.message);
      });
  }, []);

  // Handle click event for each batch
  const handleRowClick = (batch) => {
    const basePath = userRole === 'QA Manager' ? '/qa-manager' : '/qa-team';
    navigate(`${basePath}/add-qarecord?vegetableType=${batch.vegetableType}&batchId=${batch._id}`);
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Incoming Batches</h2>
      {error && <p className="text-red-600 text-center">{error}</p>}
      <table
        className={`table-auto w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
      >
        <thead>
          <tr className="bg-[#11532F] text-white">
            <th className="py-4 px-6 text-center border border-[#58ab31]">Vegetable Type</th>
            <th className="py-4 px-6 text-center border border-[#58ab31]">Total Weight (kg)</th>
            <th className="py-4 px-6 text-center border border-[#58ab31]">Arrival Date</th>
          </tr>
        </thead>
        <tbody>
          {batches.length > 0 ? (
            batches.map((batch) => (
              <tr
                key={batch._id}
                onClick={() => handleRowClick(batch)}
                className="hover:bg-green-100 cursor-pointer transition duration-200 ease-in-out transform hover:scale-105"
              >
                <td className="border border-[#58ab31] py-4 px-6 text-center">{batch.vegetableType}</td>
                <td className="border border-[#58ab31] py-4 px-6 text-center">{batch.totalWeight}</td>
                <td className="border border-[#58ab31] py-4 px-6 text-center">{new Date(batch.arrivalDate).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4">No incoming batches found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IncomingBatches;
