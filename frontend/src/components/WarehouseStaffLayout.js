import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const WarehouseStaffLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-green-900 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Inventory Control</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/wh-staff/inventory-dashboard" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/wh-staff/add-stocks" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                Add Stocks
              </Link>
            </li>
            <li>
              <Link to="/wh-staff/update-stocks" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                Update Inventory
              </Link>
            </li>
            <li>
              <Link to="/wh-staff/add-incomingBatch" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                Incoming Batches
              </Link>
            </li>
            <li>
              <Link to="/wh-staff/all-stocks" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                View Inventory
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 bg-gray-100 h-screen overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default WarehouseStaffLayout;
