import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import the autotable plugin for jsPDF
import logo from "./LogoImage.png"

const AdminCropReadinessList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    Pending: 0,
    InProgress: 0,
    Completed: 0,
  });
  const [visibleAttachments, setVisibleAttachments] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/cropReadiness/all-notifications"
        );
        setNotifications(response.data);
        setLoading(false);

        const pendingCount = response.data.filter(
          (item) => item.status === "Pending"
        ).length;
        const inProgressCount = response.data.filter(
          (item) => item.status === "In Progress"
        ).length;
        const completedCount = response.data.filter(
          (item) => item.status === "Completed"
        ).length;

        setStatusCounts({
          Pending: pendingCount,
          InProgress: inProgressCount,
          Completed: completedCount,
        });
      } catch (error) {
        console.error("Error fetching crop readiness notifications:", error);
        setError("Failed to load notifications.");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3001/cropReadiness/update-status/${id}`,
        { status: newStatus }
      );
      setNotifications(
        notifications.map((notification) =>
          notification._id === id
            ? { ...notification, status: newStatus }
            : notification
        )
      );

      const updatedNotifications = notifications.map((notification) =>
        notification._id === id
          ? { ...notification, status: newStatus }
          : notification
      );

      const pendingCount = updatedNotifications.filter(
        (item) => item.status === "Pending"
      ).length;
      const inProgressCount = updatedNotifications.filter(
        (item) => item.status === "In Progress"
      ).length;
      const completedCount = updatedNotifications.filter(
        (item) => item.status === "Completed"
      ).length;

      setStatusCounts({
        Pending: pendingCount,
        InProgress: inProgressCount,
        Completed: completedCount,
      });

      alert("Notification status updated successfully.");
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

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.farmerNIC
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      notification.cropVariety
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      new Date(notification.preferredPickupDate)
        .toLocaleDateString()
        .includes(searchQuery);

    const matchesStatus = statusFilter
      ? notification.status === statusFilter
      : true;

    return matchesSearch && matchesStatus;
  });

  const generatePDF = () => {
    if (filteredNotifications.length === 0) {
      alert("No notifications available for PDF export!");
      return;
    }

    const doc = new jsPDF();

    // Company Header
    const companyName = 'GSP Traders Pvt Ltd';
    const address = 'A12, Dedicated Economic Centre, Nuwara Eliya, Sri Lanka';
    const email = 'gsptraders29@gmail.com';
    const phone = '+94 77 7144 133';

    doc.setTextColor('#11532F'); // Company green color
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName, 195, 20, { align: 'right' });

    const imgData = logo;  // Use imported logo
    doc.addImage(imgData, 'PNG', 15, 15, 25, 25);  


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
    doc.text('Crop Readiness Notifications Report', 105, 60, { align: 'center' });

    // Table for notifications
    const tableRows = filteredNotifications.map((notification) => [
      notification.farmerNIC,
      notification.cropVariety,
      notification.quantity,
      notification.expectedQuality,
      new Date(notification.preferredPickupDate).toLocaleDateString(),
      notification.preferredPickupTime,
      notification.status,
    ]);

    doc.autoTable({
      startY: 70,
      head: [
        ['NIC', 'Crop Variety', 'Quantity', 'Expected Quality', 'Pickup Date', 'Pickup Time', 'Status'],
      ],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: '#11532F' },
    });

    // Divider
    doc.setDrawColor('#11532F');
    doc.setLineWidth(0.5);
    doc.line(10, doc.lastAutoTable.finalY + 10, 200, doc.lastAutoTable.finalY + 10);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Generated on: ' + new Date().toLocaleString(), 105, doc.lastAutoTable.finalY + 20, { align: 'center' });

    // Save the PDF
    doc.save('Crop_Readiness_Notifications_Report.pdf');
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
        All Crop Readiness Notifications
      </h1>

      {/* Search and Filter Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FaSearch
            className="mr-2 text-gray-600 cursor-pointer"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          />
          {isSearchOpen && (
            <input
              type="text"
              placeholder="Search by NIC, Crop Variety or Date"
               className="border px-4 py-2 rounded-lg ml-2 w-72"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
        </div>

        <select
          className="border px-4 py-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {filteredNotifications.length === 0 ? (
        <p className="text-lg text-gray-600">No notifications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-700 text-white uppercase text-sm leading-normal">
                <th className="py-4 px-6 text-left font-semibold">NIC</th>
                <th className="py-4 px-6 text-left font-semibold">
                  Crop Variety
                </th>
                <th className="py-4 px-6 text-left font-semibold">Quantity</th>
                <th className="py-4 px-6 text-left font-semibold">
                  Expected Quality
                </th>
                <th className="py-4 px-6 text-left font-semibold">
                  Preferred Pickup Date
                </th>
                <th className="py-4 px-6 text-left font-semibold">
                  Preferred Pickup Time
                </th>
                <th className="py-4 px-6 text-left font-semibold">Attachments</th>
                <th className="py-4 px-6 text-left font-semibold">Status</th>
                
                <th className="py-4 px-6 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filteredNotifications.map((notification) => (
                <tr
                  key={notification._id}
                  className="border-b border-gray-200 hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-4 px-6 whitespace-nowrap">
                    {notification.farmerNIC}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {notification.cropVariety}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {notification.quantity}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {notification.expectedQuality}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {new Date(
                      notification.preferredPickupDate
                    ).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {notification.preferredPickupTime}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {/* Render Attachments Toggle */}
                    <button
                      onClick={() =>
                        setVisibleAttachments((prev) => ({
                          ...prev,
                          [notification._id]: !prev[notification._id],
                        }))
                      }
                      className="text-blue-500 hover:underline"
                    >
                      {visibleAttachments[notification._id]
                        ? "Hide"
                        : "Show"}
                    </button>
                    {visibleAttachments[notification._id] && (
                      <ul className="list-disc list-inside mt-2">
                        {notification.attachments && notification.attachments.length > 0 && (
                          notification.attachments.map((attachment, index) => (
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
                          ))
                        )}
                      </ul>
                    )}
                  </td>
                  <td
                    className={`py-4 px-6 whitespace-nowrap font-bold ${getStatusColor(
                      notification.status
                    )}`}
                  >
                    {notification.status}
                  </td>
                  
                  <td className="py-4 px-6 whitespace-nowrap flex flex-col space-y-2">
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
    onClick={() =>
      handleStatusUpdate(notification._id, "In Progress")
    }
  >
    In Progress
  </button>
  <button
    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
    onClick={() =>
      handleStatusUpdate(notification._id, "Completed")
    }
  >
    Completed
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
          <div className="py-4">
            {/* Button to Generate PDF Report */}
            <button
              onClick={generatePDF}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition mb-4"
            >
              Generate PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCropReadinessList;
