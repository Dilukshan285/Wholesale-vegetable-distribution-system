import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa"; // Importing magnifying glass icon
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "./LogoImage.png";

const AdminPickupRequestList = () => {
  const [pickupRequests, setPickupRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter
  const [showSearchBox, setShowSearchBox] = useState(false); // State to toggle search input visibility

  // Fetch all pickup requests for admins
  useEffect(() => {
    axios
      .get("http://localhost:3001/pickup-request/all-pickup-requests")
      .then((response) => {
        setPickupRequests(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pickup requests:", err);
        setError("Failed to load pickup requests.");
        setLoading(false);
      });
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/pickup-request/update-status/${id}`,
        { status: newStatus }
      );
      console.log("Response data:", response.data); // Add this line to check the response

      if (response.status === 200) {
        setPickupRequests(
          pickupRequests.map((request) =>
            request._id === id ? { ...request, status: newStatus } : request
          )
        );
        alert("Pickup request status updated and email sent successfully.");
      } else {
        alert("Status updated, but email could not be sent.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "In Progress":
        return "bg-blue-200 text-blue-800";
      case "Completed":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // Filter and search logic
  // Filter and search logic
  const filteredRequests = pickupRequests.filter((request) => {
    const matchesSearch =
      request.NIC.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.crops.some((crop) =>
        crop.cropType.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      new Date(request.preferredDate)
        .toLocaleDateString()
        .includes(searchQuery); // Match preferred date with search query

    const matchesStatus = statusFilter ? request.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  const generateReport = () => {
    const pdf = new jsPDF();
    const date = new Date();

    // Company Header
    const companyName = "GSP Traders Pvt Ltd";
    const address = "A12, Dedicated Economic Centre, Nuwara Eliya, Sri Lanka";
    const email = "gsptraders29@gmail.com";
    const phone = "+94 77 7144 133";

    pdf.setTextColor("#11532F"); // Company green color
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(companyName, 195, 20, { align: "right" });

    const imgData = logo; // Assuming logo is defined elsewhere
    pdf.addImage(imgData, "PNG", 15, 15, 25, 25);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(address, 195, 28, { align: "right" });
    pdf.text(`Email: ${email}`, 195, 34, { align: "right" });
    pdf.text(`Phone: ${phone}`, 195, 40, { align: "right" });

    // Divider
    pdf.setDrawColor("#11532F");
    pdf.setLineWidth(1);
    pdf.line(10, 50, 200, 50);

    // Report title
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0); // Reset to black for main content
    pdf.setFont("helvetica", "bold");
    pdf.text("Pickup Requests Report", 105, 60, { align: "center" });

    // Table for Pickup Requests
    const tableBody = pickupRequests.map((request) => [
      request.NIC,
      request.crops.map((crop) => crop.cropType).join(", "),
      request.crops.map((crop) => crop.quantity).join(", "),
      new Date(request.preferredDate).toLocaleDateString(),
      request.preferredTime,
      request.address,
      request.status || "Pending",
    ]);

    pdf.autoTable({
      head: [
        [
          "NIC",
          "Crop Types",
          "Quantities",
          "Preferred Date",
          "Preferred Time",
          "Address",
          "Status",
        ],
      ],
      body: tableBody,
      startY: 80,
      theme: "grid",
      headStyles: { fillColor: "#11532F" },
    });

    // Status Summary Section
    const finalY = pdf.lastAutoTable.finalY || 90; // Get the Y-position after the last table
    pdf.setFontSize(14);
    pdf.setTextColor("#11532F");
    pdf.text("Status Summary", 20, finalY + 20);

    // Gather status counts
    const statusCounts = {
      Pending: pickupRequests.filter((req) => req.status === "Pending").length,
      "In Progress": pickupRequests.filter(
        (req) => req.status === "In Progress"
      ).length,
      Completed: pickupRequests.filter((req) => req.status === "Completed")
        .length,
    };

    pdf.autoTable({
      startY: finalY + 30,
      head: [["Status", "Count"]],
      body: [
        ["Pending", statusCounts.Pending],
        ["In Progress", statusCounts["In Progress"]],
        ["Completed", statusCounts.Completed],
      ],
      theme: "grid",
      headStyles: { fillColor: "#11532F" },
    });

    // Final Y after status summary table
    const lastY = pdf.lastAutoTable.finalY || finalY + 30;

    // Check if the footer can fit on the same page, otherwise add a new page
    if (lastY + 40 > pdf.internal.pageSize.height) {
      pdf.addPage();
      lastY = 20; // Reset Y-coordinate for new page
    }

    // Divider for separation
    pdf.setDrawColor("#11532F");
    pdf.setLineWidth(0.5);
    pdf.line(10, lastY + 10, 200, lastY + 10);

    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.setFont("helvetica", "normal");
    pdf.text("Generated on: " + new Date().toLocaleString(), 105, lastY + 20, {
      align: "center",
    });

    // Save the PDF
    pdf.save(
      `Pickup_Requests_Report_${date.getFullYear()}_${date.getMonth() + 1}.pdf`
    );
  };

  if (loading) {
    return <div className="text-center mt-5 text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        All Pickup Requests
      </h1>

      {/* Search and Filter Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          {/* Magnifying Glass Button */}
          <button
            className="p-2 text-gray-600 hover:text-gray-800"
            onClick={() => setShowSearchBox(!showSearchBox)} // Toggle search box visibility
          >
            <FaSearch size={24} />
          </button>

          {/* Search Input */}
          {showSearchBox && (
            <input
              type="text"
              placeholder="Search by NIC , date or Crop"
              className="border px-4 py-2 rounded-lg ml-2 transition-all duration-200 ease-in-out w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
        </div>

        {/* Status Filter */}
        <select
          className="border px-4 py-2 rounded-lg ml-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {filteredRequests.length === 0 ? (
        <p className="text-lg text-gray-600">No pickup requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-700 text-white uppercase text-sm leading-normal">
                <th className="py-4 px-6 text-left font-semibold">NIC</th>
                <th className="py-4 px-6 text-left font-semibold">
                  Crop Types
                </th>
                <th className="py-4 px-6 text-left font-semibold">
                  Quantities
                </th>
                <th className="py-4 px-6 text-left font-semibold">
                  Preferred Date
                </th>
                <th className="py-4 px-6 text-left font-semibold">
                  Preferred Time
                </th>
                <th className="py-4 px-6 text-left font-semibold">Address</th>
                <th className="py-4 px-6 text-left font-semibold">Status</th>
                <th className="py-4 px-6 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filteredRequests.map((request) => (
                <tr
                  key={request._id}
                  className="border-b border-gray-200 hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-4 px-6 whitespace-nowrap">{request.NIC}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {request.crops.map((crop, index) => (
                      <div key={index}>{crop.cropType}</div> // Display crop types in separate lines
                    ))}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {request.crops.map((crop, index) => (
                      <div key={index}>{crop.quantity}</div> // Display quantities in separate lines
                    ))}
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    {new Date(request.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {request.preferredTime}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {request.address}
                  </td>
                  <td
                    className={`py-4 px-6 whitespace-nowrap ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status || "Pending"}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <select
                      className="border px-2 py-1 rounded-lg"
                      value={request.status || "Pending"}
                      onChange={(e) =>
                        handleStatusUpdate(request._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Generate Report Button */}
      <div className="mt-6 text-right">
        <button
          onClick={generateReport}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default AdminPickupRequestList;
