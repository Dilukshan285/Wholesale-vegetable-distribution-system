import React from "react";

const ConfirmModal = ({ message, onConfirm, onCancel, show }) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out ${
        show ? "opacity-100 visible animate-fadeIn" : "opacity-0 invisible"
      }`}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 ease-in-out ${
          show ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
        }`}
      >
        <h3 className="text-lg font-semibold">Confirmation</h3>
        <p className="mt-2">{message}</p>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
