import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const QAStandards = () => {
  const [standards, setStandards] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await fetch("http://localhost:3001/qaStandards");
        if (response.ok) {
          const data = await response.json();
          setStandards(data);
        } else {
          console.error("Failed to fetch QA standards");
        }
      } catch (err) {
        console.error("Error fetching QA standards:", err);
      }
    };

    fetchStandards();
  }, []);

  const handleUpdateClick = (vegetableType) => {
    navigate(`/qa-manager/qa-standards/update`, { state: { vegetableType } });
  };

  return (
    <div className="max-w-6xl mx-auto my-10 p-8 bg-gray-100 rounded-lg shadow-lg transition-transform duration-300">
      <h2 className="text-4xl text-center text-gray-800 mb-8 tracking-wide">QA Standards</h2>
      {standards.map((standard) => (
        <div
          className="mb-10 p-5 bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-transform duration-300"
          key={standard._id}
        >
          <h3 className="text-3xl text-green-600 text-center font-semibold mb-5">
            {standard.vegetableType}
          </h3>
          <div className="flex flex-col md:flex-row md:justify-between gap-5">
            <div className="flex-1 p-5 bg-gray-200 rounded-md shadow-sm hover:bg-teal-50 transition-colors duration-300">
              <h4 className="text-xl font-semibold mb-3">Grade A</h4>
              <ul className="list-none space-y-2">
                <li>Weight: {standard.gradeA.weight}</li>
                <li>Shape: {standard.gradeA.shape}</li>
                <li>Color: {standard.gradeA.color}</li>
                <li>Blemishes: {standard.gradeA.blemishes}</li>
              </ul>
            </div>
            <div className="flex-1 p-5 bg-gray-200 rounded-md shadow-sm hover:bg-teal-50 transition-colors duration-300">
              <h4 className="text-xl font-semibold mb-3">Grade B</h4>
              <ul className="list-none space-y-2">
                <li>Weight: {standard.gradeB.weight}</li>
                <li>Shape: {standard.gradeB.shape}</li>
                <li>Color: {standard.gradeB.color}</li>
                <li>Blemishes: {standard.gradeB.blemishes}</li>
              </ul>
            </div>
            <div className="flex-1 p-5 bg-gray-200 rounded-md shadow-sm hover:bg-teal-50 transition-colors duration-300">
              <h4 className="text-xl font-semibold mb-3">Grade C</h4>
              <ul className="list-none space-y-2">
                <li>Weight: {standard.gradeC.weight}</li>
                <li>Shape: {standard.gradeC.shape}</li>
                <li>Color: {standard.gradeC.color}</li>
                <li>Blemishes: {standard.gradeC.blemishes}</li>
              </ul>
            </div>
          </div>

          {/* Conditionally render the update button based on the current path */}
          {location.pathname.includes("/qa-manager/qa-standards") && (
            <div className="text-right mt-5">
              <button
                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                onClick={() => handleUpdateClick(standard.vegetableType)}
              >
                Update
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QAStandards;
