import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const LayoutVFManager = () => {
  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <nav className="w-60 bg-green-900 text-white shadow-lg">
        <div className="p-6">
          <Link to="/vehicle-fleet">
          <h2 className="text-3xl font-semibold mb-8">Vehicle Fleet</h2>
          </Link>
          <ul className="space-y-4">
            <li>
              <Link to="/vehicle-fleet/vehicle-management" className="block px-4 py-2 rounded-lg hover:bg-green-500">Vehicle Management</Link>
            </li>
            <li>
              <Link to="/vehicle-fleet/driver-management" className="block px-4 py-2 rounded-lg hover:bg-green-500">Driver Management</Link>
            </li>
            <li>
              <Link to="/vehicle-fleet/fuel-management" className="block px-4 py-2 rounded-lg hover:bg-green-500">Fuel Management</Link>
            </li>
            <li>
              <Link to="/vehicle-fleet/maintenance-management" className="block px-4 py-2 rounded-lg hover:bg-green-500">Maintenance Management</Link>
            </li>
            <li>
              <Link to="/vehicle-fleet/cost-management" className="block px-4 py-2 rounded-lg hover:bg-green-500">Cost Management</Link>
            </li>
            <li>
              <Link to="/vehicle-fleet/logout" className="block px-4 py-2 rounded-lg hover:bg-green-500">Logout</Link>
            </li>
          </ul>
        </div>
      </nav>
      

      {/* Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>

    
  );
  
};

export default LayoutVFManager;

