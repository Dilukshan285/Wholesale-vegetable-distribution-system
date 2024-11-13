import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import jsPDF autotable

export default function CustomerRequestDB() {
  const [customerRequest, setCustomerRequest] = useState([]);
  const [editId, setEditId] = useState(-1);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  // Search state
  const [selectedDateRange, setSelectedDateRange] = useState("");

  // Edit fields
  const [editPickupLocation, setEditPickupLocation] = useState("");
  const [editPickupDate, setEditPickupDate] = useState("");
  const [editPickupTime, setEditPickupTime] = useState("");
  const [editSelectedVehicle, setEditSelectedVehicle] = useState("");

  const apiUrl = "http://localhost:3001/api";

  useEffect(() => {
    getCustomerRequest();
  }, []);

  const getCustomerRequest = () => {
    fetch(apiUrl + "/customerRequest")
      .then((res) => res.json())
      .then((res) => {
        setCustomerRequest(res);
      });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditPickupLocation(item.pickupLocation);
    setEditPickupDate(item.pickupDate);
    setEditPickupTime(item.pickupTime);
    setEditSelectedVehicle(item.selectedVehicle);
  };

  const handleUpdate = () => {
    setError("");

    if (
      editPickupLocation.trim() !== "" &&
      editPickupDate.trim() !== "" &&
      editPickupTime.trim() !== "" &&
      editSelectedVehicle.trim() !== ""
    ) {
      fetch(apiUrl + "/customerRequest/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickupLocation: editPickupLocation,
          pickupDate: editPickupDate,
          pickupTime: editPickupTime,
          selectedVehicle: editSelectedVehicle,
        }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedCustomerRequest = customerRequest.map((item) => {
              if (item._id === editId) {
                item.pickupLocation = editPickupLocation;
                item.pickupDate = editPickupDate;
                item.pickupTime = editPickupTime;
                item.selectedVehicle = editSelectedVehicle;
              }
              return item;
            });

            setCustomerRequest(updatedCustomerRequest);
            setSuccessMessage("Customer request updated successfully");
            setError("");
            setTimeout(() => {
              setSuccessMessage("");
            }, 3000);
            setEditId(-1);
          } else {
            setError("Unable to update customer request");
          }
        })
        .catch(() => {
          setError("Failed to fetch");
        });
    } else {
      setError("All fields are required");
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete?")) {
      fetch(apiUrl + "/customerRequest/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedCustomerRequest = customerRequest.filter(
          (item) => item._id !== id
        );
        setCustomerRequest(updatedCustomerRequest);
      });
    }
  };

  // Handle search range selection
  const handleSearchChange = (e) => {
    setSelectedDateRange(e.target.value);
  };

  const filterCustomerRequestsByDateRange = () => {
    if (!selectedDateRange) return customerRequest;

    const [minDay, maxDay] = selectedDateRange.split("-").map(Number);

    return customerRequest.filter((item) => {
      const dayOfMonth = parseInt(item.pickupDate.split("-")[2], 10); // Assuming date format YYYY-MM-DD
      return dayOfMonth >= minDay && dayOfMonth <= maxDay;
    });
  };

// Function to generate PDF
const exportToPDF = () => {
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
  doc.text(companyName, 195, 20, { align: 'right' }); // Align company name

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(address, 195, 28, { align: 'right' }); // Align address
  doc.text(`Email: ${email}`, 195, 34, { align: 'right' }); // Align email
  doc.text(`Phone: ${phone}`, 195, 40, { align: 'right' }); // Align phone

  // Divider
  doc.setDrawColor('#11532F');
  doc.setLineWidth(1);
  doc.line(10, 50, 200, 50);

  // Add a title for the report
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0); // Reset color to black
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Requests', 105, 60, { align: 'center' }); // Center title

  // Sort the customer requests by both date and time in ascending order
  const sortedCustomerRequests = filterCustomerRequestsByDateRange().sort((a, b) => {
    const dateA = new Date(a.pickupDate);
    const dateB = new Date(b.pickupDate);
    
    if (dateA - dateB !== 0) {
      return dateA - dateB; // Sort by date first
    }

    // Sort by time if dates are the same
    const timeA = parseInt(a.pickupTime.replace(':', ''), 10);
    const timeB = parseInt(b.pickupTime.replace(':', ''), 10);
    return timeA - timeB; // Sort by time
  });

  // Table Headers
  const tableColumn = ["No", "Pickup Location", "Pickup Date", "Pickup Time", "Vehicle"];
  const tableRows = sortedCustomerRequests.map((item, index) => {
    const formattedDate = new Date(item.pickupDate).toLocaleDateString(); // Format the date
    const formattedTime = item.pickupTime.padStart(5, '0'); // Ensure time is in HH:mm format
    return [
      index + 1,
      item.pickupLocation,
      formattedDate, // Use the formatted date here
      formattedTime, // Format time correctly to "XX:XX"
      item.selectedVehicle,
    ];
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 70, // Adjust starting Y position after title
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
  doc.save("customer_requests.pdf");
};


  return (
    <>
      <div className="container mx-auto mt-3 bg-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-center text-gray-800 mt-6 mb-4">
            Customer Requests
          </h1>

          {/* Search Dropdown in Top Right Corner */}
          <div className="flex flex-col ml-4">
            <label htmlFor="date-range" className="text-gray-700">Search by Date Range:</label>
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
          <button onClick={exportToPDF} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Export PDF
          </button>
        </div>

        <ul className="mt-3">
          {filterCustomerRequestsByDateRange().map((item) => (
            <li
              className="bg-blue-100 p-4 rounded-lg shadow-lg flex justify-between items-center mb-4"
              key={item._id}
            >
              <div>
                {editId === -1 || editId !== item._id ? (
                  <>
                    <p className="font-bold text-gray-700">{item.pickupLocation}</p>
                    <p className="text-gray-600">{item.pickupDate}</p>
                    <p className="text-gray-600">{item.pickupTime}</p>
                    <p className="text-gray-600">{item.selectedVehicle}</p>
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={editPickupLocation}
                      onChange={(e) => setEditPickupLocation(e.target.value)}
                      className="border border-gray-300 p-1 rounded mr-2"
                      placeholder="Pickup Location"
                    />
                    <input
                      type="date"
                      value={editPickupDate}
                      onChange={(e) => setEditPickupDate(e.target.value)}
                      className="border border-gray-300 p-1 rounded mr-2"
                    />
                    <input
                      type="time"
                      value={editPickupTime}
                      onChange={(e) => setEditPickupTime(e.target.value)}
                      className="border border-gray-300 p-1 rounded mr-2"
                    />
                    <select
                      value={editSelectedVehicle}
                      onChange={(e) => setEditSelectedVehicle(e.target.value)}
                      className="border border-gray-300 p-1 rounded mr-2"
                    >
                      <option value="">Select Vehicle</option>
                      <option value="Company Vehicle">Company Vehicle</option>
                      <option value="Farmer Vehicle">Farmer Vehicle</option>
                    </select>
                    <button
                      onClick={handleUpdate}
                      className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
    </>
  );
}
