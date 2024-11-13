import React from "react";

const SuccessModal = ({ message, onClose, show }) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out ${
        show ? "opacity-100 visible animate-fadeIn" : "opacity-0 invisible"
      }`}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg text-center transform transition-transform duration-300 ease-in-out ${
          show ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
        }`}
      >
        <h3 className="text-lg font-semibold">Success</h3>
        <p className="mt-2 text-green-600">{message}</p>
        <button
          className="mt-4 px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors duration-200"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
