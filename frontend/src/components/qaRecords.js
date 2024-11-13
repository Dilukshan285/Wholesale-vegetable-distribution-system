import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ConfirmModal from "./modals/ConfirmModal";
import SuccessModal from "./modals/SuccessModal";
import logo from "./LogoImage.png";
import jsPDF from "jspdf";
import "jspdf-autotable";

const QARecords = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [updatedRecord, setUpdatedRecord] = useState({
    vegetableType: "",
    gradeAWeight: "",
    gradeBWeight: "",
    gradeCWeight: "",
  });
  const [vegetableFilter, setVegetableFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState(""); // Year filter
  const [monthFilter, setMonthFilter] = useState(""); // Month filter
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch("http://localhost:3001/QArecord");
        if (response.ok) {
          const data = await response.json();
          setRecords(data);
          setFilteredRecords(data);
        } else {
          console.error("Failed to fetch records:", response.statusText);
        }
      } catch (err) {
        console.error("Error fetching records:", err);
      }
    };

    fetchRecords();
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = records;

    if (vegetableFilter !== "All") {
      filtered = filtered.filter(
        (record) => record.vegetableType === vegetableFilter
      );
    }

    if (yearFilter) {
      filtered = filtered.filter((record) => {
        const recordYear = new Date(record.dateCreated).getFullYear();
        return recordYear === parseInt(yearFilter);
      });
    }

    if (monthFilter) {
      filtered = filtered.filter((record) => {
        const recordMonth = new Date(record.dateCreated).getMonth() + 1; // getMonth() is zero-indexed
        return recordMonth === parseInt(monthFilter);
      });
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.dateCreated)
          .toISOString()
          .split("T")[0];
        return recordDate === dateFilter;
      });
    }

    setFilteredRecords(filtered);
  }, [vegetableFilter, yearFilter, monthFilter, dateFilter, records]);

  const handleEdit = (record) => {
    setEditingRecord(record);
    setUpdatedRecord({
      ...record,
      totalWeight:
        record.gradeAWeight + record.gradeBWeight + record.gradeCWeight,
      wastedWeight:
        record.totalWeight -
        (record.gradeAWeight + record.gradeBWeight + record.gradeCWeight),
    });
  };

  const handleWeightChange = (field, value) => {
    const updated = { ...updatedRecord, [field]: Number(value) };

    // Calculate total weight
    updated.totalWeight =
      updated.gradeAWeight + updated.gradeBWeight + updated.gradeCWeight;

    // Calculate wasted weight (total - sum of grade weights)
    updated.wastedWeight =
      editingRecord.totalWeight -
      (updated.gradeAWeight + updated.gradeBWeight + updated.gradeCWeight);

    setUpdatedRecord(updated);
  };

  const fetchRecords = async () => {
    try {
      const response = await fetch("http://localhost:3001/QArecord");
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
        setFilteredRecords(data);
      } else {
        console.error("Failed to fetch records:", response.statusText);
      }
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  // useEffect to initially fetch records when the component mounts
  useEffect(() => {
    fetchRecords();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validate wasted weight
    if (updatedRecord.wastedWeight < 0) {
      alert("Wasted weight cannot be negative. Please adjust the grades.");
      return; // Stop submission
    }

    try {
      // Create the payload without wastedWeight
      const payload = {
        gradeAWeight: updatedRecord.gradeAWeight,
        gradeBWeight: updatedRecord.gradeBWeight,
        gradeCWeight: updatedRecord.gradeCWeight,
        vegetableType: updatedRecord.vegetableType,
      };

      const response = await fetch(
        `http://localhost:3001/QArecord/update/${editingRecord._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload), // Send only the necessary fields
        }
      );

      if (response.ok) {
        await fetchRecords(); // Re-fetch the records
        setEditingRecord(null);
        setUpdateSuccess(true);
        setShowSuccessModal(true);
      } else {
        alert("Error updating record");
      }
    } catch (err) {
      console.error("Error updating record:", err);
      alert("Error updating record");
    }
  };

  const handleDelete = (id) => {
    setRecordToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/QArecord/delete/${recordToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setRecords(records.filter((record) => record._id !== recordToDelete));
        setShowSuccessModal(true);
      } else {
        alert("Error deleting record");
      }
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Error deleting record");
    } finally {
      setShowConfirmModal(false);
      setRecordToDelete(null);
    }
  };

  const generatePDF = () => {
    if (!records || records.length === 0) {
      alert("No QA records available!");
      return;
    }

    const doc = new jsPDF();

    // Company Header
    const companyName = "GSP Traders Pvt Ltd";
    const address = "A12, Dedicated Economic Centre, Nuwara Eliya, Sri Lanka";
    const email = "gsptraders29@gmail.com";
    const phone = "+94 77 7144 133";

    // Set company details
    doc.setTextColor("#11532F"); // Company green color
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(companyName, 195, 20, { align: "right" });

    const imgData = logo; // Use imported logo
    doc.addImage(imgData, "PNG", 15, 15, 25, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(address, 195, 28, { align: "right" });
    doc.text(`Email: ${email}`, 195, 34, { align: "right" });
    doc.text(`Phone: ${phone}`, 195, 40, { align: "right" });

    // Divider
    doc.setDrawColor("#11532F");
    doc.setLineWidth(1);
    doc.line(10, 50, 200, 50);

    // Add report title with month
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentMonth = monthNames[new Date().getMonth()];
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Reset color to black
    doc.setFont("helvetica", "bold");
    doc.text(`Monthly QA Weight Report - ${currentMonth}`, 105, 60, {
      align: "center",
    });

    // Table for Vegetable Details
    doc.setFontSize(14);
    doc.setTextColor("#11532F");
    doc.text("Vegetable Weights:", 20, 75); // Section title

    const totalWeights = records.reduce((acc, record) => {
      const { vegetableType, totalWeight, wastedWeight } = record;
      if (!acc[vegetableType]) {
        acc[vegetableType] = { totalWeight: 0, wastedWeight: 0 };
      }
      acc[vegetableType].totalWeight += totalWeight;
      acc[vegetableType].wastedWeight += wastedWeight;
      return acc;
    }, {});

    // Generate table data for total weights
    const tableData = Object.entries(totalWeights).map(
      ([vegetableType, { totalWeight, wastedWeight }]) => [
        vegetableType,
        totalWeight.toFixed(2),
        wastedWeight.toFixed(2),
      ]
    );

    doc.autoTable({
      startY: 85,
      head: [["Vegetable Type", "Total Weight (kg)", "Wasted Weight (kg)"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: "#11532F" },
      margin: { left: 20, right: 20 },
    });

    // Divider
    doc.setDrawColor("#11532F");
    doc.setLineWidth(0.5);
    doc.line(
      10,
      doc.lastAutoTable.finalY + 20,
      200,
      doc.lastAutoTable.finalY + 20
    );

    // Current Records Table
    doc.setFontSize(14);
    doc.setTextColor("#11532F");
    doc.text("Current QA Records:", 20, doc.lastAutoTable.finalY + 30); // Section title

    const currentRecordsData = filteredRecords.map((record) => [
      record.vegetableType,
      record.gradeAWeight.toFixed(2),
      record.gradeBWeight.toFixed(2),
      record.gradeCWeight.toFixed(2),
      record.totalWeight.toFixed(2),
      record.wastedWeight.toFixed(2),
      record.dateCreated, // Adjust this if you want a specific format
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 40,
      head: [
        [
          "Vegetable Type",
          "Grade A Weight (kg)",
          "Grade B Weight (kg)",
          "Grade C Weight (kg)",
          "Total Weight (kg)",
          "Wasted Weight (kg)",
          "Date Created",
        ],
      ],
      body: currentRecordsData,
      theme: "grid",
      headStyles: { fillColor: "#11532F" },
      margin: { left: 20, right: 20 },
    });

    // Divider
    doc.setDrawColor("#11532F");
    doc.setLineWidth(0.5);
    doc.line(
      10,
      doc.lastAutoTable.finalY + 20,
      200,
      doc.lastAutoTable.finalY + 20
    );

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Generated on: " + new Date().toLocaleDateString(),
      105,
      doc.lastAutoTable.finalY + 30,
      { align: "center" }
    );

    // Get current month for the file name
    const fileName = `QA_Record_for_Month - ${currentMonth}.pdf`;

    // Preview the PDF in a new window
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const pdfWindow = window.open(pdfUrl);

    // Optionally add a download button in the window (use this method if needed):
    if (pdfWindow) {
      pdfWindow.onload = () => {
        const downloadButton = pdfWindow.document.createElement("button");
        downloadButton.innerText = "Download PDF";
        downloadButton.style.position = "fixed";
        downloadButton.style.top = "10px";
        downloadButton.style.right = "10px";
        downloadButton.onclick = () => {
          doc.save(fileName); // Download the file
        };
        pdfWindow.document.body.appendChild(downloadButton);
      };
    }
  };

  const vegetableTypes = [
    ...new Set(records.map((record) => record.vegetableType)),
  ];
  const years = [
    ...new Set(
      records.map((record) => new Date(record.dateCreated).getFullYear())
    ),
  ];

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <div className="qa-records w-4/5 mx-auto mt-8 p-6 animate-fadeIn">
      <h2 className="text-center mb-5 text-2xl font-bold text-gray-800">
        QA Records
      </h2>
      <div className="flex justify-center items-center mb-5 gap-6 flex-wrap">
        <label htmlFor="vegetableFilter" className="text-lg">
          Filter by Vegetable:
        </label>
        <select
          id="vegetableFilter"
          value={vegetableFilter}
          onChange={(e) => setVegetableFilter(e.target.value)}
          className="p-2 text-lg border border-gray-300 rounded-md"
        >
          <option value="All">All</option>
          {vegetableTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label htmlFor="yearFilter" className="text-lg">
          Filter by Year:
        </label>
        <select
          id="yearFilter"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="p-2 text-lg border border-gray-300 rounded-md"
        >
          <option value="">All</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Date filter */}
        <label htmlFor="dateFilter" className="text-lg">
          Filter by Date:
        </label>
        <input
          type="date"
          id="dateFilter"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-2 text-lg border border-gray-300 rounded-md"
        />

        <label htmlFor="monthFilter" className="text-lg">
          Filter by Month:
        </label>
        <select
          id="monthFilter"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="p-2 text-lg border border-gray-300 rounded-md"
        >
          <option value="">All</option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      {location.pathname !== "/qa-team/qa-records" && (
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 mx-auto block"
          onClick={generatePDF}
        >
          Download Report
        </button>
      )}

      <table className="w-full max-w-5xl mx-auto mt-5 border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">
              Vegetable Type
            </th>
            <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">
              Grade A Weight
            </th>
            <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">
              Grade B Weight
            </th>
            <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">
              Grade C Weight
            </th>
            <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">
              Total Weight
            </th>{" "}
            {/* New Column */}
            <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">
              Wasted Weight
            </th>{" "}
            {/* New Column */}
            <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">
              Date Created
            </th>
            <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">
              Time Created
            </th>
            <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => {
            const createdAt = new Date(record.dateCreated);
            const date = createdAt.toLocaleDateString();
            const time = createdAt.toLocaleTimeString();

            return (
              <tr
                key={record._id}
                className="hover:bg-green-100 cursor-pointer transition duration-200 ease-in-out transform hover:scale-105"
              >
                <td className="p-4 border border-gray-300">
                  {record.vegetableType}
                </td>
                <td className="p-4 border border-gray-300">
                  {record.gradeAWeight}
                </td>
                <td className="p-4 border border-gray-300">
                  {record.gradeBWeight}
                </td>
                <td className="p-4 border border-gray-300">
                  {record.gradeCWeight}
                </td>
                <td className="p-4 border border-gray-300">
                  {record.totalWeight}
                </td>{" "}
                {/* New Field */}
                <td className="p-4 border border-gray-300">
                  {record.wastedWeight}
                </td>{" "}
                {/* New Field */}
                <td className="p-4 border border-gray-300">{date}</td>
                <td className="p-4 border border-gray-300">{time}</td>
                <td className="p-4 border border-gray-300 flex gap-3">
                  <button
                    className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition-transform transform hover:scale-105 active:scale-95"
                    onClick={() => handleEdit(record)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition-transform transform hover:scale-105 active:scale-95"
                    onClick={() => handleDelete(record._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editingRecord && (
        <>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
              <h3 className="text-xl font-semibold mb-6 text-center">
                Edit Record
              </h3>
              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Other fields */}
                <div className="form-group">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Grade A Weight:
                  </label>
                  <input
                    type="number"
                    value={updatedRecord.gradeAWeight}
                    onChange={(e) =>
                      handleWeightChange("gradeAWeight", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Grade B Weight:
                  </label>
                  <input
                    type="number"
                    value={updatedRecord.gradeBWeight}
                    onChange={(e) =>
                      handleWeightChange("gradeBWeight", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Grade C Weight:
                  </label>
                  <input
                    type="number"
                    value={updatedRecord.gradeCWeight}
                    onChange={(e) =>
                      handleWeightChange("gradeCWeight", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Total Weight:
                  </label>
                  <input
                    type="number"
                    value={updatedRecord.totalWeight}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Wasted Weight:
                  </label>
                  <input
                    type="number"
                    value={updatedRecord.wastedWeight}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-transform transform hover:scale-105"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingRecord(null)}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-transform transform hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {showSuccessModal && (
        <SuccessModal
          message={
            updateSuccess
              ? "Record updated successfully"
              : "Record deleted successfully"
          }
          onClose={() => {
            setShowSuccessModal(false);
            setUpdateSuccess(false);
          }}
          show={showSuccessModal}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete this record?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
          show={showConfirmModal}
        />
      )}
    </div>
  );
};

export default QARecords;
