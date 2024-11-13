import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const WarehouseManagerLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-green-900 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Inventory Control</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/wh-manager/manager-dashboard" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/wh-manager/add-staff" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                Register Staff
              </Link>
            </li>
            <li>
              <Link to="/wh-manager/all-staff" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                Staff Management
              </Link>
            </li>
            <li>
              <Link to="/wh-manager/unit-prices" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                Unit Prices
              </Link>
            </li>
            <li>
              <Link to="/wh-manager/delivery-history" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                Delivery History
              </Link>
            </li>
            <li>
              <Link to="/wh-manager/all-stocks" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                View Inventory
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow p-6 bg-gray-100 h-screen overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default WarehouseManagerLayout;
