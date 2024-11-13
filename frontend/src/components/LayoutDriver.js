import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const LayoutDriver = () => {
  return (
    <div className="flex h-screen bg-gray-200">
      
      {/* Sidebar */}
      <nav className="w-60 bg-green-900 text-white shadow-lg">
        <div className="p-6">
          <Link to="/driver">
          <h2 className="text-3xl font-semibold mb-8">Driver's Page</h2>
          </Link>
          <ul className="space-y-4">
            <li>
              <Link to="/driver/driver-page" className="block px-4 py-2 rounded-lg hover:bg-green-500">Add fuel purchase reciept</Link>
            </li>
            <li>
              <Link to="/driver/profile" className="block px-4 py-2 rounded-lg hover:bg-green-500">View Profile</Link>
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

export default LayoutDriver;

