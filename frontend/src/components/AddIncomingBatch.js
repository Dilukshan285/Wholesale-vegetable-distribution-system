import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddIncomingBatch = () => {
  const [formData, setFormData] = useState({
    vegetableType: "",
    totalWeight: "",
    arrivalDate: "",
  });

  const [message, setMessage] = useState("");
  const [minDateTime, setMinDateTime] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Set the minimum date to today
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // Adjust for timezone
    const localISOTime = new Date(now - offset).toISOString().slice(0, 16);
    setMinDateTime(localISOTime);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/incomingBatches/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Batch added successfully!");
        setFormData({
          vegetableType: "",
          totalWeight: "",
          arrivalDate: "",
        });

        // Navigate to "/qa-team/incoming-batches" after success
        navigate("/qa-team/incoming-batches");
      } else {
        setMessage("Error: " + data);
      }
    } catch (error) {
      setMessage("Failed to add batch.");
    }
  };

  return (
    <div className="max-w-xl m-3 bg-white p-6 rounded-lg shadow-md flex-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Add Incoming Batch</h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.includes("success") ? "bg-green-200" : "bg-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#11532F] font-medium mb-2" htmlFor="vegetableType">
              Vegetable Type
            </label>
            <select
              name="vegetableType"
              value={formData.vegetableType}
              onChange={handleChange}
              className="mt-1 block w-full h-12 border-2 border-gray-300 focus:border-green-500 rounded-md px-3"
              required
            >
              <option value="">Select Vegetable</option>
              <option value="Carrot">Carrot</option>
              <option value="Leeks">Leek</option>
              <option value="Cabbage">Cabbage</option>
              <option value="Potato">Potato</option>
            </select>
          </div>

          <div>
            <label className="block text-[#11532F] font-medium mb-2" htmlFor="totalWeight">
              Total Weight (kg)
            </label>
            <input
              type="number"
              name="totalWeight"
              value={formData.totalWeight}
              onChange={handleChange}
              className="mt-1 block w-full h-12 border-2 border-gray-300 focus:outline-none focus:border-green-500 rounded-md px-3"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-[#11532F] font-medium mb-2" htmlFor="arrivalDate">
              Arrival Date
            </label>
            <input
              type="datetime-local"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleChange}
              className="mt-1 block w-full h-12 border-2 border-gray-300 focus:outline-none focus:border-green-500 rounded-md px-3"
              min={minDateTime}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-[#24c527] text-white font-semibold rounded-md hover:bg-green-600 transition duration-200 mt-20"
          >
            Add Batch
          </button>
        </form>
    </div>
  );
};

export default AddIncomingBatch;
