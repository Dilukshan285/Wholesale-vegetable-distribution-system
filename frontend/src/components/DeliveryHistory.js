import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './LogoImage.png';

export default function DeliveryHistory() {
  const [stocks, setStocks] = useState([]);
  const [totalQuantities, setTotalQuantities] = useState({});
  const [searchVegType, setSearchVegType] = useState(""); // State for vegetable type search
  const [searchYear, setSearchYear] = useState(""); // State for year search
  const [searchMonth, setSearchMonth] = useState(""); // State for month search
  const [searchQualityGrade, setSearchQualityGrade] = useState(""); // State for quality grade search

  useEffect(() => {
    function getStocks() {
      axios.get("http://localhost:3001/stock/all-stocks")
        .then(res => {
          setStocks(res.data.stocks);
          setTotalQuantities(res.data.totalQuantities);
        })
        .catch(err => console.log(err));
    }
    getStocks();
  }, []);

  // Filter stocks based on search criteria
  const filteredStocks = stocks.filter(stock => {
    const stockDate = new Date(stock.dateAdded);

    const matchesVegType = !searchVegType || stock.vegType.toLowerCase() === searchVegType.toLowerCase();
    const matchesYear = !searchYear || stockDate.getFullYear().toString() === searchYear;
    const matchesMonth = !searchMonth || (stockDate.getMonth() + 1).toString() === searchMonth;
    const matchesQualityGrade = !searchQualityGrade || stock.qualityGrade.toLowerCase() === searchQualityGrade.toLowerCase();

    return matchesVegType && matchesYear && matchesMonth && matchesQualityGrade;
  });

  // Function to download the filtered records as a PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add company header
    const companyName = 'GSP Traders Pvt Ltd';
    const address = 'A12, Dedicated Economic Centre, Nuwara Eliya, Sri Lanka';
    const email = 'gsptraders29@gmail.com';
    const phone = '+94 77 7144 133';

    doc.setTextColor('#11532F'); // Company green color
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName, 195, 20, { align: 'right' });

    const imgData = logo; // Assuming logo is defined or imported
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

    // Add title for the report
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Delivery History Report', 105, 60, { align: 'center' });

    // Define table headers and data
    const tableColumn = ["Index", "Date Added", "Vegetable Type", "Quality Grade", "Batch Number", "Quantity (kg)", "Expiration Date"];
    const tableRows = [];

    // Populate the tableRows array with filtered stocks data
    filteredStocks.forEach((stock, index) => {
      const stockData = [
        index + 1,
        new Date(stock.dateAdded).toLocaleDateString(),
        stock.vegType,
        stock.qualityGrade,
        stock.batchNumber,
        stock.quantity,
        new Date(stock.expDate).toLocaleDateString(),
      ];
      tableRows.push(stockData);
    });

    // Add table to the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 70,  // Adjusted to fit under the title and header
      theme: 'grid',
      headStyles: { fillColor: '#11532F' }
    });

    // Divider for separation
    doc.setDrawColor('#11532F');
    doc.setLineWidth(0.5);
    doc.line(10, doc.lastAutoTable.finalY + 10, 200, doc.lastAutoTable.finalY + 10);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated on: ' + new Date().toLocaleDateString(), 105, doc.lastAutoTable.finalY + 20, { align: 'center' });

    // Save the PDF
    doc.save("Delivery_History_Report.pdf");
  };

  return (
    <div className="m-3 bg-white p-6 rounded-lg shadow-md flex-auto max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-3">Delivery History</h1>
      
      <div className="overflow-x-auto">
        <hr className="mb-6"/>

        {/* Search Fields */}  
        <div className="mb-6 flex justify-between">
          <div className="flex space-x-4">
            {/* Search by Vegetable Type - Changed to Select */}
            <select
              className="p-2 border border-gray-300 rounded"
              value={searchVegType}
              onChange={(e) => setSearchVegType(e.target.value)}
            >
              <option value="" disabled>Select Vegetable Type</option>
              <option value="Carrot">Carrot</option>
              <option value="Leeks">Leeks</option>
              <option value="Cabbage">Cabbage</option>
              <option value="Potato">Potato</option>
            </select>

            {/* Search by Quality Grade */}
            <select
              className="p-2 border border-gray-300 rounded"
              value={searchQualityGrade}
              onChange={(e) => setSearchQualityGrade(e.target.value)}
            >
              <option value="" disabled>Select Quality Grade</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>

            {/* Search by Month */}
            <select
              className="p-2 border border-gray-300 rounded"
              value={searchMonth}
              onChange={(e) => setSearchMonth(e.target.value)}
            >
              <option value="" disabled>Select Month</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>

            {/* Search by Year */}
            <input
              type="text"
              placeholder="Search by Year"
              className="p-2 border border-gray-300 rounded"
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
            />
          </div>

          {/* Button to Download PDF */}
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
          >
            Download PDF
          </button>
        </div>

        {filteredStocks.length > 0 ? (
          <>
            {/* Table displaying filtered stock entries */}
            <table className="min-w-full bg-white rounded mb-8">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Index</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date Added</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Vegetable Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Quality Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Batch Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Quantity (kg)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Expiration Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-6 py-4 border-b">{index + 1}</td>
                    <td className="px-6 py-4 border-b">{new Date(stock.dateAdded).toLocaleDateString()}</td>
                    <td className="px-6 py-4 border-b">{stock.vegType}</td>
                    <td className="px-6 py-4 border-b">{stock.qualityGrade}</td>
                    <td className="px-6 py-4 border-b">{stock.batchNumber}</td>
                    <td className="px-6 py-4 border-b">{stock.quantity}</td>
                    <td className="px-6 py-4 border-b">{new Date(stock.expDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-6">No stocks match your search criteria.</p>
        )}
      </div>
    </div>
  );
}
