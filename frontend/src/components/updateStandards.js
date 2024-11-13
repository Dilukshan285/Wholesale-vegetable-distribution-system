import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const UpdateStandards = () => {
  const location = useLocation();
  const { vegetableType } = location.state || {}; // Get vegetableType from location state

  const [standards, setStandards] = useState({
    vegetableType: vegetableType || "",
    gradeA: { weight: "", color: "", shape: "", damages: "", blemishes: "" },
    gradeB: { weight: "", color: "", shape: "", damages: "", blemishes: "" },
    gradeC: { weight: "", color: "", shape: "", damages: "", blemishes: "" },
  });

  const [vegetableTypes, setVegetableTypes] = useState([
    "Carrot",
    "Leek",
    "Cabbage",
    "Potato",
  ]);
  const [selectedVegetable, setSelectedVegetable] = useState(
    vegetableType || ""
  );

  useEffect(() => {
    const fetchStandards = async () => {
      if (selectedVegetable) {
        try {
          const response = await fetch(
            `http://localhost:3001/qaStandards/vegetable/${selectedVegetable}`
          );
          if (response.ok) {
            const data = await response.json();
            setStandards(data);
          } else {
            console.error(
              "Failed to fetch QA standards for the selected vegetable"
            );
          }
        } catch (err) {
          console.error("Error fetching QA standards:", err);
        }
      }
    };

    fetchStandards();
  }, [selectedVegetable]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/qaStandards/update/${standards._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(standards),
        }
      );
      if (response.ok) {
        alert("Standards updated successfully!");
      } else {
        console.error("Failed to update QA standards");
      }
    } catch (err) {
      console.error("Error updating QA standards:", err);
    }
  };

  const handleInputChange = (e, grade, field) => {
    setStandards((prev) => ({
      ...prev,
      [grade]: {
        ...prev[grade],
        [field]: e.target.value,
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-4xl text-center text-gray-800 mb-8 tracking-wide">
        Update QA Standards
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="vegetableType"
            className="block text-lg font-semibold mb-2"
          >
            Select Vegetable
          </label>
          <select
            id="vegetableType"
            value={selectedVegetable}
            onChange={(e) => setSelectedVegetable(e.target.value)}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring focus:ring-teal-300"
            required
          >
            <option value="" disabled>
              Select a vegetable
            </option>
            {vegetableTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {selectedVegetable && (
          <>
            {/* Grade A Section */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4">Grade A</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Weight
                  </label>
                  <input
                    type="number"
                    value={standards.gradeA.weight}
                    onChange={(e) => handleInputChange(e, "gradeA", "weight")}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    value={standards.gradeA.color}
                    onChange={(e) => handleInputChange(e, "gradeA", "color")}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Shape
                  </label>
                  <input
                    type="text"
                    value={standards.gradeA.shape}
                    onChange={(e) => handleInputChange(e, "gradeA", "shape")}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Blemishes
                  </label>
                  <input
                    type="text"
                    value={standards.gradeA.blemishes}
                    onChange={(e) =>
                      handleInputChange(e, "gradeA", "blemishes")
                    }
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Grade B Section */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4">Grade B</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Weight
                  </label>
                  <input
                    type="number"
                    value={standards.gradeB.weight}
                    onChange={(e) => handleInputChange(e, "gradeB", "weight")}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    value={standards.gradeB.color}
                    onChange={(e) => handleInputChange(e, "gradeB", "color")}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Shape
                  </label>
                  <input
                    type="text"
                    value={standards.gradeB.shape}
                    onChange={(e) => handleInputChange(e, "gradeB", "shape")}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Blemishes
                  </label>
                  <input
                    type="text"
                    value={standards.gradeB.blemishes}
                    onChange={(e) =>
                      handleInputChange(e, "gradeB", "blemishes")
                    }
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Grade C Section */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4">Grade C</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Weight
                  </label>
                  <input
                    type="number"
                    value={standards.gradeC.weight}
                    onChange={(e) => handleInputChange(e, "gradeC", "weight")}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    value={standards.gradeC.color}
                    onChange={(e) => handleInputChange(e, "gradeC", "color")}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Shape
                  </label>
                  <input
                    type="text"
                    value={standards.gradeC.shape}
                    onChange={(e) => handleInputChange(e, "gradeC", "shape")}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Blemishes
                  </label>
                  <input
                    type="text"
                    value={standards.gradeC.blemishes}
                    onChange={(e) =>
                      handleInputChange(e, "gradeC", "blemishes")
                    }
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full p-4 bg-[#11532F] text-white font-semibold text-lg rounded-lg hover:bg-[#1A7F48]"
            >
              Update Standards
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default UpdateStandards;
