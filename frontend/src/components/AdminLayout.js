// AdminLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-green-900 text-white fixed h-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Farmer Management</h2>
          <ul className="space-y-4">
            <li>
              <Link to="admin-dashboard" className="block py-2 px-4 hover:bg-green-600 rounded focus:bg-green-600 rounded">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="all-farmers" className="block py-2 px-4 hover:bg-green-600 rounded focus:bg-green-600 rounded">
                All Farmers
              </Link>
            </li>
            <li>
              <Link to="all-crop-readiness" className="block py-2 px-4 hover:bg-green-600 rounded focus:bg-green-600 rounded">
                All Crop Readiness Requests
              </Link>
            </li>
            <li>
              <Link to="all-pickup-requests" className="block py-2 px-4 hover:bg-green-600 rounded focus:bg-green-600 rounded">
                All Pick up Requests
              </Link>
            </li>
            
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow ml-64 p-6 bg-gray-100 h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
