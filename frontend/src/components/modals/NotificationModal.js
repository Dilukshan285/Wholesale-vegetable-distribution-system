import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const NotificationModal = ({ message, show, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Modal disappears after 4 seconds

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [show, onClose]);

  const handleClick = () => {
    // Redirect the user to the /incoming-batches path
    navigate("/qa-manager/incoming-batches");
    onClose(); // Close the notification after clicking
  };

  return (
    <div
      className={`fixed top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg z-50 cursor-pointer transition-all duration-300 ease-in-out ${
        show ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 pointer-events-none"
      }`}
      onClick={handleClick}
    >
      <p className="text-lg font-semibold">{message}</p>
    </div>
  );
};

export default NotificationModal;
