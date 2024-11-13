import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; // Import magnifying glass icon
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from "./LogoImage.png"

function AllFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Search state
  const [filterGender, setFilterGender] = useState(''); // Filter state
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Toggle search bar visibility

  useEffect(() => {
    function getFarmers() {
      axios
        .get('http://localhost:3001/farmer/all-farmers')
        .then((res) => {
          setFarmers(res.data);
        })
        .catch((err) => {
          alert(err.message);
        });
    }
    getFarmers();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      axios
        .delete(`http://localhost:3001/farmer/delete/${id}`)
        .then(() => {
          setFarmers(farmers.filter((farmer) => farmer._id !== id));
        })
        .catch((err) => {
          alert('Error deleting farmer: ' + err.message);
        });
    }
  };

  const formatDate = (dob) => {
    const date = new Date(dob);
    return date.toISOString().split('T')[0];
  };

  const maskPassword = (password) => {
    return '*'.repeat(password.length);
  };

  // Search and filter logic
  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.NIC.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.contact.includes(searchQuery);

    const matchesFilter = filterGender ? farmer.gender === filterGender : true;

    return matchesSearch && matchesFilter;
  });

  const generateReport = () => {
    const pdf = new jsPDF();
    const date = new Date();
  
    // Company Header
    const companyName = 'GSP Traders Pvt Ltd';
    const address = 'A12, Dedicated Economic Centre, Nuwara Eliya, Sri Lanka';
    const email = 'gsptraders29@gmail.com';
    const phone = '+94 77 7144 133';
  
    pdf.setTextColor('#11532F'); // Company green color
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(companyName, 195, 20, { align: 'right' });
  
    const imgData = logo;  // Assuming logo is defined elsewhere
    pdf.addImage(imgData, 'PNG', 15, 15, 25, 25);
  
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(address, 195, 28, { align: 'right' });
    pdf.text(`Email: ${email}`, 195, 34, { align: 'right' });
    pdf.text(`Phone: ${phone}`, 195, 40, { align: 'right' });
  
    // Divider
    pdf.setDrawColor('#11532F');
    pdf.setLineWidth(1);
    pdf.line(10, 50, 200, 50);
  
    // Report title
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0); // Reset to black for main content
    pdf.setFont('helvetica', 'bold');
    pdf.text('Farmers Report', 105, 60, { align: 'center' });
    
  
    // Table for Filtered Farmers
    const tableBody = filteredFarmers.map((farmer) => [
      farmer.firstName,
      farmer.lastName,
      formatDate(farmer.DOB),
      farmer.email,
      farmer.age,
      farmer.gender,
      farmer.NIC,
      farmer.address,
      farmer.contact,
      
    ]);
  
    pdf.autoTable({
      head: [['First Name', 'Last Name', 'Date of Birth', 'Email', 'Age', 'Gender', 'NIC', 'Address', 'Contact No.']],
      body: tableBody,
      startY: 80,
      theme: 'grid',
      headStyles: { fillColor: '#11532F' },
    });
  
    // Status Summary Section (Optional)
    const finalY = pdf.lastAutoTable.finalY || 90; // Get the Y-position after the last table
    pdf.setFontSize(14);
    pdf.setTextColor('#11532F');
    pdf.text('Status Summary', 20, finalY + 20);
  
    // Gather status counts (if applicable)
    const statusCounts = {
      Male: filteredFarmers.filter(farmer => farmer.gender === 'Male').length,
      Female: filteredFarmers.filter(farmer => farmer.gender === 'Female').length,
    };
  
    pdf.autoTable({
      startY: finalY + 30,
      head: [['Gender', 'Count']],
      body: [
        ['Male', statusCounts.Male],
        ['Female', statusCounts.Female],
      ],
      theme: 'grid',
      headStyles: { fillColor: '#11532F' },
    });
  
    // Final Y after status summary table
    const lastY = pdf.lastAutoTable.finalY || finalY + 30;
  
    // Check if the footer can fit on the same page, otherwise add a new page
    if (lastY + 40 > pdf.internal.pageSize.height) {
      pdf.addPage();
      lastY = 20;  // Reset Y-coordinate for new page
    }
  
    // Divider for separation
    pdf.setDrawColor('#11532F');
    pdf.setLineWidth(0.5);
    pdf.line(10, lastY + 10, 200, lastY + 10);
  
    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Generated on: ' + new Date().toLocaleString(), 105, lastY + 20, { align: 'center' });
  
    // Save the PDF
    pdf.save(`Farmers_Report_${date.getFullYear()}_${date.getMonth() + 1}.pdf`);
  };
  

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">All Farmers</h1>

      {/* Search and Filter Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          {/* Magnifying Glass Icon */}
          <FaSearch
            className="mr-3 text-gray-600 cursor-pointer text-xl"
            onClick={() => setIsSearchOpen(!isSearchOpen)} // Toggle search bar visibility
          />
          {/* Search Bar */}
          {isSearchOpen && (
            <input
              type="text"
              placeholder="Search by Email, NIC, or Contact"
              className="border border-gray-300 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 w-96"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
        </div>

        {/* Filter by Gender */}
        <select
          className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* Farmer Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="py-3 px-6 text-left text-sm uppercase font-medium tracking-wider">First Name</th>
              <th className="py-3 px-6 text-left text-sm uppercase font-medium tracking-wider">Last Name</th>
              <th className="py-3 px-6 text-left text-sm uppercase font-medium tracking-wider">Date of Birth</th>
              <th className="py-3 px-6 text-left text-sm uppercase font-medium tracking-wider">Email</th>
              <th className="py-3 px-6 text-left text-sm uppercase font-medium tracking-wider">Age</th>
              <th className="py-3 px-6 text-left text-sm uppercase font-medium tracking-wider">Gender</th>
              <th className="py-3 px-6 text-left text-sm uppercase font-medium tracking-wider">NIC</th>
              <th className="py-3 px-6 text-left text-sm uppercase font-medium tracking-wider">Address</th>
              <th className="py-3 px-6 text-left text-sm uppercase font-medium tracking-wider">Contact No.</th>
              <th className="py-3 px-6 text-left text-sm uppercase font-medium tracking-wider">Password</th>
              <th className="py-3 px-6 text-left text-sm uppercase font-medium tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmers.length > 0 ? (
              filteredFarmers.map((farmer, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition duration-300">
                  <td className="py-3 px-6 text-sm">{farmer.firstName}</td>
                  <td className="py-3 px-6 text-sm">{farmer.lastName}</td>
                  <td className="py-3 px-6 text-sm">{formatDate(farmer.DOB)}</td>
                  <td className="py-3 px-6 text-sm">{farmer.email}</td>
                  <td className="py-3 px-6 text-sm">{farmer.age}</td>
                  <td className="py-3 px-6 text-sm">{farmer.gender}</td>
                  <td className="py-3 px-6 text-sm">{farmer.NIC}</td>
                  <td className="py-3 px-6 text-sm">{farmer.address}</td>
                  <td className="py-3 px-6 text-sm">{farmer.contact}</td>
                  <td className="py-3 px-6 text-sm">{maskPassword(farmer.password)}</td>
                  <td className="py-3 px-6">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/update/${farmer._id}`}
                        className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition duration-200"
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => handleDelete(farmer._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="py-6 text-center text-gray-500">No farmers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
}

export default AllFarmers;
