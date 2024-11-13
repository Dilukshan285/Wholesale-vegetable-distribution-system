import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import the autotable plugin


export default function FarmerRequestDB() {
  const [farmerRequest, setFarmerRequest] = useState([]);
  const [editId, setEditId] = useState(-1);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  // Edit
  const [editLocation, setEditLocation] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editSelectedVehicle, setEditSelectedVehicle] = useState("");

  // Search filter
  const [selectedDateRange, setSelectedDateRange] = useState("");

  const apiUrl = "http://localhost:3001/api";

  useEffect(() => {
    getFarmerRequest();
  }, []);

  const getFarmerRequest = () => {
    fetch(apiUrl + "/farmerRequest")
        .then((res) => res.json())
        .then((res) => {
            const formattedRequests = res.map(item => ({
                ...item,
                date: new Date(item.date).toISOString().split('T')[0] // Format date
            }));
            setFarmerRequest(formattedRequests);
        });
};


  const handleEdit = (item) => {
    setEditId(item._id);
    setEditLocation(item.location);
    setEditDate(item.date);
    setEditTime(item.time);
    setEditSelectedVehicle(item.selectedVehicle);
  };

  const handleEditCancel = () => {
    setEditId(-1);
  };

  const handleUpdate = () => {
    setError("");

    if (editLocation.trim() && editDate.trim() && editTime.trim() && editSelectedVehicle.trim()) {
      fetch(apiUrl + "/farmerRequest/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: editLocation,
          date: editDate,
          time: editTime,
          selectedVehicle: editSelectedVehicle,
        }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedFarmerRequest = farmerRequest.map((item) => {
              if (item._id === editId) {
                item.location = editLocation;
                item.date = editDate;
                item.time = editTime;
                item.selectedVehicle = editSelectedVehicle;
              }
              return item;
            });

            setFarmerRequest(updatedFarmerRequest);
            setSuccessMessage("Farmer request updated successfully");
            setError("");
            setTimeout(() => {
              setSuccessMessage("");
            }, 3000);

            setEditId(-1);
          } else {
            setError("Unable to update farmer request");
          }
        })
        .catch(() => {
          setError("Failed to fetch");
        });
    } else {
      setError("All fields are required.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete?")) {
      fetch(apiUrl + "/farmerRequest/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedFarmerRequest = farmerRequest.filter((item) => item._id !== id);
        setFarmerRequest(updatedFarmerRequest);
      });
    }
  };

  const handleSearchChange = (e) => {
    setSelectedDateRange(e.target.value);
  };

  const filterFarmerRequestsByDateRange = () => {
    if (selectedDateRange === "") return farmerRequest;

    const dateRange = selectedDateRange.split("-");
    const minDay = parseInt(dateRange[0], 10);
    const maxDay = parseInt(dateRange[1], 10);

    return farmerRequest.filter((item) => {
      const dayOfMonth = parseInt(item.date.split("-")[2], 10); // Assuming date format YYYY-MM-DD
      return dayOfMonth >= minDay && dayOfMonth <= maxDay;
    });
  };

 
  const exportPDF = () => {
    // Initialize jsPDF
    const doc = new jsPDF();
  
    // Company Header
    const companyName = 'GSP Traders Pvt Ltd';
    const address = 'A12, Dedicated Economic Centre, Nuwara Eliya, Sri Lanka';
    const email = 'gsptraders29@gmail.com';
    const phone = '+94 77 7144 133';
  
    // Set company details color and font
    doc.setTextColor('#11532F'); // Company green color
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName, 195, 20, { align: 'right' });
  
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(address, 195, 28, { align: 'right' });
    doc.text(`Email: ${email}`, 195, 34, { align: 'right' });
    doc.text(`Phone: ${phone}`, 195, 40, { align: 'right' });
  
    // Divider
    doc.setDrawColor('#11532F');
    doc.setLineWidth(1);
    doc.line(10, 50, 200, 50);
  
    // Add a title for the report
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Reset color to black
    doc.setFont('helvetica', 'bold');
    doc.text('Farmer Requests', 105, 60, { align: 'center' });
  
    // Sort farmerRequest by date and time (assuming ISO format for date)
    const sortedFarmerRequest = farmerRequest.sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time);
      const dateB = new Date(b.date + 'T' + b.time);
      return dateA - dateB; // Ascending order
    });
  
    // Table Headers
    const tableColumn = ["No", "Location", "Date", "Time", "Vehicle"];
    const tableRows = sortedFarmerRequest.map((item, index) => [
      index + 1,
      item.location,
      item.date.split('T')[0], // Format date as 'YYYY-MM-DD'
      item.time,
      item.selectedVehicle
    ]);
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 70,
      theme: 'grid',
      styles: {
        cellPadding: 5,
        fontSize: 12,
        overflow: 'linebreak',
        tableLineColor: '#11532F',
        tableLineWidth: 0.75,
      },
      headStyles: {
        fillColor: '#11532F',
        textColor: '#FFFFFF',
        fontSize: 14,
        font: 'helvetica',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: '#F2F2F2'
      }
    });
  
    // Save the PDF
    doc.save("farmer_requests.pdf");
  };

  return (
    <div className="container mx-auto mt-3 bg-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-center text-gray-800 mt-6 mb-4">Farmer Requests</h1>
        
        {/* Search Filter Dropdown */}
        <div className="flex flex-col mr-4">
          <label htmlFor="date-range" className="text-gray-700">Filter by Date Range:</label>
          <select
            id="date-range"
            className="border border-gray-300 p-2 rounded"
            value={selectedDateRange}
            onChange={handleSearchChange}
          >
            <option value="">All Dates</option>
            <option value="1-5">1-5</option>
            <option value="6-10">6-10</option>
            <option value="11-15">11-15</option>
            <option value="16-20">16-20</option>
            <option value="21-25">21-25</option>
            <option value="26-30">26-30</option>
          </select>
        </div>

        {/* Export PDF Button */}
        <button onClick={exportPDF} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Export PDF
        </button>
      </div>

      <ul className="mt-3">
        {filterFarmerRequestsByDateRange().map((item) => (
          <li
            className="bg-blue-100 p-4 rounded-lg shadow-lg flex justify-between items-center mb-4"
            key={item._id}
          >
            <div>
              {editId === -1 || editId !== item._id ? (
                <>
                  <p className="font-bold text-gray-700">{item.location}</p>
                  <p className="text-gray-600">{item.date}</p>
                  <p className="text-gray-600">{item.time}</p>
                  <p className="text-gray-600">{item.selectedVehicle}</p>
                </>
              ) : (
                <div>
                  <div className="mb-2">
                    <label htmlFor="pickup-location" className="block text-gray-700">Pickup Location</label>
                    <input
                      type="text"
                      id="pickup-location"
                      placeholder="Enter your location"
                      onChange={(e) => setEditLocation(e.target.value)}
                      value={editLocation}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>

                  <div className="mb-2">
                    <label htmlFor="pickup-date" className="block text-gray-700">PickUp Date</label>
                    <input
                      type="text"
                      id="pickup-date"
                      placeholder="PickUp Date"
                      onChange={(e) => setEditDate(e.target.value)}
                      value={editDate}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>

                  <div className="mb-2">
                    <label htmlFor="pickup-time" className="block text-gray-700">PickUp Time</label>
                    <input
                      type="text"
                      id="pickup-time"
                      placeholder="PickUp Time"
                      onChange={(e) => setEditTime(e.target.value)}
                      value={editTime}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-gray-700">Vehicle Type</label>
                    <select
                      onChange={(e) => setEditSelectedVehicle(e.target.value)}
                      value={editSelectedVehicle}
                      className="border border-gray-300 p-2 rounded w-full"
                    >
                      <option value="" disabled>Select vehicle type</option>
                      <option value="Farmer Vehicle">Farmer Vehicle</option>
                      <option value="Company Vehicle">Company Vehicle</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {editId === -1 || editId !== item._id ? (
                <button className="bg-yellow-500 text-white py-1 px-4 rounded hover:bg-yellow-600" onClick={() => handleEdit(item)}>
                  Edit
                </button>
              ) : (
                <button className="bg-yellow-500 text-white py-1 px-4 rounded hover:bg-yellow-600" onClick={handleUpdate}>
                  Update
                </button>
              )}
              {editId === -1 ? (
                <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600" onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              ) : (
                <button className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600" onClick={handleEditCancel}>
                  Cancel
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
