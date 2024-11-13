import React, { useRef } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import logo from "../components/LogoImage.png";

// Register Chart.js components
Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdvancedCharts = ({ ordersData }) => {
  const printRef = useRef(); // Reference to the component for capturing

  const orderStatuses = ordersData.map((order) => order.status);
  const paymentStatuses = ordersData.map((order) =>
    order.payment ? "Paid" : "Unpaid"
  );

  const statusCounts = {
    Processing: orderStatuses.filter((status) => status === "Processing")
      .length,
    Shipped: orderStatuses.filter((status) => status === "Shipped").length,
    Delivered: orderStatuses.filter((status) => status === "Delivered").length,
    Cancelled: orderStatuses.filter((status) => status === "Cancelled").length,
  };

  const paymentCounts = {
    Paid: paymentStatuses.filter((status) => status === "Paid").length,
    Unpaid: paymentStatuses.filter((status) => status === "Unpaid").length,
  };

  // Helper function to group orders by date
  const groupOrdersByDate = (orders) => {
    return orders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      if (!acc[date]) {
        acc[date] = { totalAmount: 0, orderCount: 0 };
      }
      acc[date].totalAmount += order.amount;
      acc[date].orderCount += 1;

      return acc;
    }, {});
  };

  // Aggregate the data by date
  const aggregatedData = groupOrdersByDate(ordersData);

  // Sort the dates in ascending order
  const sortedDates = Object.keys(aggregatedData).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const orderAmountsByDay = sortedDates.map(
    (date) => aggregatedData[date].totalAmount
  );
  const orderCountsByDay = sortedDates.map(
    (date) => aggregatedData[date].orderCount
  );

  // Multi-Axis Chart (Revenue and Orders per Day)
  const trendData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Revenue ($)",
        data: orderAmountsByDay,
        type: "line",
        borderColor: "#FF6384",
        yAxisID: "y-axis-1",
        fill: false,
      },
      {
        label: "Order Count",
        data: orderCountsByDay,
        backgroundColor: "#36A2EB",
        yAxisID: "y-axis-2",
      },
    ],
  };

  // Stacked Bar Chart for Orders by Status
  const stackedBarData = {
    labels: ["Processing", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        label: "Order Count",
        data: [
          statusCounts.Processing,
          statusCounts.Shipped,
          statusCounts.Delivered,
          statusCounts.Cancelled,
        ],
        backgroundColor: ["#FFCE56", "#36A2EB", "#4BC0C0", "#FF6384"],
      },
    ],
  };

  // Doughnut Chart for Payment Status
  const doughnutData = {
    labels: ["Paid", "Unpaid"],
    datasets: [
      {
        data: [paymentCounts.Paid, paymentCounts.Unpaid],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      yAxes: [
        {
          id: "y-axis-1",
          type: "linear",
          position: "left",
          ticks: {
            beginAtZero: true,
          },
          scaleLabel: {
            display: true,
            labelString: "Revenue ($)",
          },
        },
        {
          id: "y-axis-2",
          type: "linear",
          position: "right",
          ticks: {
            beginAtZero: true,
          },
          scaleLabel: {
            display: true,
            labelString: "Order Count",
          },
        },
      ],
    },
  };

  const generatePDF = () => {
    const input = printRef.current;
    const doc = new jsPDF("p", "mm", "a4");
    const pageHeight = doc.internal.pageSize.height;

    // Company Header
    const companyName = "GSP Traders Pvt Ltd";
    const address = "A12, Dedicated Economic Centre, Nuwara Eliya, Sri Lanka";
    const email = "gsptraders29@gmail.com";
    const phone = "+94 77 7144 133";
    const imgData = logo; // Use imported logo

    // Set company details color and font
    doc.setTextColor("#11532F"); // Company green color
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(companyName, 195, 20, { align: "right" });

    // Add the company logo
    doc.addImage(imgData, "PNG", 15, 15, 25, 25);

    // Add address and contact details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(address, 195, 28, { align: "right" });
    doc.text(`Email: ${email}`, 195, 34, { align: "right" });
    doc.text(`Phone: ${phone}`, 195, 40, { align: "right" });

    // Divider line
    doc.setDrawColor("#11532F");
    doc.setLineWidth(1);
    doc.line(10, 50, 200, 50);

    // Title of the report
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Reset color to black
    doc.setFont("helvetica", "bold");
    doc.text("Charts Summary", 105, 60, { align: "center" });

    // Divider line after title
    // doc.setDrawColor("#11532F");
    // doc.setLineWidth(0.5);
    // doc.line(10, 65, 200, 65);

    // Add chart section after the header
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = doc.internal.pageSize.getWidth() - 20; // Adjust width for left and right margins (10mm each side)
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add chart image after the header, with left and right margins
      doc.addImage(imgData, "PNG", 10, 70, pdfWidth, pdfHeight);

      // Calculate Y position after the chart
      const afterChartY = 70 + pdfHeight + 10;

      // Ensure there's space for the footer; if not, add a new page
      if (afterChartY + 30 > pageHeight) {
        doc.addPage(); // Add a new page if needed
      }

      // Footer - ensure it's at the bottom of the page
      const footerY = pageHeight - 20; // Set the footer near the bottom

      // Footer divider line
      doc.setDrawColor("#11532F");
      doc.setLineWidth(0.5);
      doc.line(10, footerY - 10, 200, footerY - 10);

      // Footer with generated date
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Generated on: ${currentDate} at ${currentTime}`,
        105,
        footerY - 5,
        { align: "center" }
      );

      // Footer contact details
      doc.setFontSize(8);
      doc.text(
        "Contact us at: info@gsptraders.com | +94 77 7144 133",
        105,
        footerY + 1,
        { align: "center" }
      );

      // Add page number at the bottom of the page
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.text(`Page ${pageCount}`, 105, pageHeight - 10, { align: "center" });

      // Save the PDF with a meaningful filename
      doc.save("charts-summary.pdf");
    });
  };

  return (
    <div class="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Detailed Sales Report</h2>

        <button
          onClick={generatePDF}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
          Print Summary as PDF
        </button>
      </div>

      {/* Charts content */}
      <div
        ref={printRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10"
      >
        {/* Multi-Axis Line & Bar Chart for Revenue and Order Trends */}
        <div className="col-span-2">
          <h3 className="text-xl font-bold mb-4">Revenue and Orders Per Day</h3>
          <Line data={trendData} options={options} />
        </div>

        {/* Stacked Bar Chart for Order Status */}
        <div>
          <h3 className="text-xl font-bold mb-4">Order Status Overview</h3>
          <Bar
            data={stackedBarData}
            options={{ scales: { x: { stacked: true }, y: { stacked: true } } }}
          />
        </div>

        {/* Doughnut Chart for Payment Status */}
        <div>
          <h3 className="text-xl font-bold mb-4">Payment Status</h3>
          <div style={{ width: "250px", height: "250px", margin: "0 auto" }}>
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCharts;
