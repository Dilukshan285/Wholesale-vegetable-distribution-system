import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const FarmerLayout = () => {
  const location = useLocation();
  
  // Define the paths where the sidebar should be hidden
  const hideSidebarPaths = ['/fm_layout/login_farmer' ,  // Existing path
    '/fm_layout/addFarmer']; // Add more paths if needed
  
  return (
    <div className="flex h-screen">
      {/* Conditionally render the sidebar */}
      {!hideSidebarPaths.includes(location.pathname) && (
        <div className="w-64 bg-green-900 text-white fixed h-full">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Farmer Portal</h2>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/fm_layout/farmer-dashboard"
                  className="block py-2 px-4 hover:bg-green-600 rounded focus:bg-green-600 rounded"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/fm_layout/land-details/:id"
                  className="block py-2 px-4 hover:bg-green-600 rounded focus:bg-green-600 rounded"
                >
                  My Land Details
                </Link>
              </li>
              <li>
                <Link
                  to="/fm_layout/land/add"
                  className="block py-2 px-4 hover:bg-green-600 rounded focus:bg-green-600 rounded"
                >
                  Add Land Details
                </Link>
              </li>
              <li>
                <Link
                  to="/fm_layout/crop-readiness"
                  className="block py-2 px-4 hover:bg-green-600 rounded focus:bg-green-600 rounded"
                >
                  Notify Crop Readiness
                </Link>
              </li>
              <li>
                <Link
                  to="/fm_layout/pickup-request"
                  className="block py-2 px-4 hover:bg-green-600 rounded focus:bg-green-600 rounded"
                >
                  Add Request Pickup
                </Link>
              </li>
              <li>
                <Link
                  to="/fm_layout/cropReadiness"
                  className="block py-2 px-4 hover:bg-green-600 rounded focus:bg-green-600 rounded"
                >
                  Notifications
                </Link>
              </li>
              <li>
                <Link
                  to="/fm_layout/pickup_requests-list"
                  className="block py-2 px-4 hover:bg-green-600 rounded focus:bg-green-600 rounded"
                >
                  Pickup Requests
                </Link>
              </li>
              <li>
                <Link
                  to="/fm_layout/farmer/profile"
                  className="block py-2 px-4 hover:bg-green-600 rounded focus:bg-green-600 rounded"
                >
                  My Profile
                </Link>
              </li>

              
            </ul>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-grow ${!hideSidebarPaths.includes(location.pathname) ? 'ml-64' : ''} p-6 bg-gray-100 h-full overflow-auto`}>
        <Outlet />
      </div>
    </div>
  );
};

export default FarmerLayout;
