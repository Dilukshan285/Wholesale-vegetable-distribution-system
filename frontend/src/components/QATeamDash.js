import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const QAteamDashboard = () => {
  const [batchCount, setBatchCount] = useState(0);
  const [qaRecordCount, setQaRecordCount] = useState(0);
  const [qaStandardCount, setQaStandardCount] = useState(0);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3001/QATeam/me', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are sent with the request
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data.member); // Fetch member details from the response
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  const fetchBatchCount = async () => {
    try {
      const response = await fetch("http://localhost:3001/incomingBatches");
      const data = await response.json();
      setBatchCount(data.length);
    } catch (error) {
      console.error("Error fetching batch data:", error);
    }
  };

  const fetchQaRecordCount = async () => {
    try {
      const response = await fetch("http://localhost:3001/QArecord");
      const data = await response.json();
      setQaRecordCount(data.length);
    } catch (error) {
      console.error("Error fetching QA record data:", error);
    }
  };

  const fetchQaStandardCount = async () => {
    try {
      const response = await fetch("http://localhost:3001/qaStandards");
      const data = await response.json();
      setQaStandardCount(data.length);
    } catch (error) {
      console.error("Error fetching QA standard data:", error);
    }
  };

  useEffect(() => {
    fetchBatchCount();
    fetchQaRecordCount();
    fetchQaStandardCount();
  }, []);

  const getTimeOfDayGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return 'Good morning';
    } else if (hours < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  return (
    <div className="p-5 text-center h-screen bg-[#58ab3114] rounded-lg">
      <h1 className="text-7xl font-semibold tracking-wider text-[#11532F] leading-relaxed">Dashboard</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : profile ? (
        <h2 className="text-3xl font-semibold mt-5">
          {getTimeOfDayGreeting()}, {profile.name}!
        </h2>
      ) : (
        <p className="text-gray-500">Loading profile...</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10">
        <Link 
          to="/qa-team/incoming-batches" 
          className="dashboard-item bg-[#58ab31] text-white p-6 rounded-lg h-48 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg animate-fadeIn"
        >
          <h2 className="text-4xl text-white leading-relaxed">Incoming Batches</h2>
          <p className="text-2xl text-black leading-relaxed">Total: {batchCount}</p>
        </Link>
        <Link 
          to="/qa-team/qa-records" 
          className="dashboard-item bg-[#58ab31] text-white p-6 rounded-lg h-48 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg animate-fadeIn"
        >
          <h2 className="text-4xl text-white leading-relaxed">QA Records</h2>
          <p className="text-2xl text-black leading-relaxed">Total: {qaRecordCount}</p>
        </Link>
        <Link 
          to="/qa-team/qa-standards" 
          className="dashboard-item bg-[#58ab31] text-white p-6 rounded-lg h-48 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg animate-fadeIn"
        >
          <h2 className="text-4xl text-white leading-relaxed">QA Standards</h2>
          <p className="text-2xl text-black leading-relaxed">Total: {qaStandardCount}</p>
        </Link>
      </div>
    </div>
  );
};

export default QAteamDashboard;
