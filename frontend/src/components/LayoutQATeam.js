import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaHome, FaBoxes, FaClipboardList, FaUser } from 'react-icons/fa';

const LayoutQATeam = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-60 bg-[#11532F] text-white fixed h-full p-5 z-50">
        <h2 className="text-3xl font-semibold mb-8">QA Team</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/qa-team"
              className="flex items-center px-4 py-3 hover:bg-[#157e47] transition duration-300 rounded-lg"
            >
              <FaHome className="mr-3" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/qa-team/qa-myprofile"
              className="flex items-center px-4 py-3 hover:bg-[#157e47] transition duration-300 rounded-lg"
            >
              <FaUser className="mr-3" />
              <span className="font-medium">My Profile</span>
            </Link>
          </li>
          <li>
            <Link
              to="/qa-team/incoming-batches"
              className="flex items-center px-4 py-3 hover:bg-[#157e47] transition duration-300 rounded-lg"
            >
              <FaBoxes className="mr-3" />
              <span className="font-medium">Incoming Batches</span>
            </Link>
          </li>
          <li>
            <Link
              to="/qa-team/qa-records"
              className="flex items-center px-4 py-3 hover:bg-[#157e47] transition duration-300 rounded-lg"
            >
              <FaClipboardList className="mr-3" />
              <span className="font-medium">QA Records</span>
            </Link>
          </li>
          <li>
            <Link
              to="/qa-team/qa-standards"
              className="flex items-center px-4 py-3 hover:bg-[#157e47] transition duration-300 rounded-lg"
            >
              <FaClipboardList className="mr-3" />
              <span className="font-medium">Quality Standards</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Content Area */}
      <main className="ml-64 p-6 flex-grow bg-white h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutQATeam;
