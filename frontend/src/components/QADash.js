import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const QADashboard = () => {
  const [batchCount, setBatchCount] = useState(0);
  const [qaRecordCount, setQaRecordCount] = useState(0);
  const [qaStandardCount, setQaStandardCount] = useState(0);
  const [qaTeamCount, setQaTeamCount] = useState(0);

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

  const fetchQaTeamCount = async () => {
    try {
      const response = await fetch("http://localhost:3001/QATeam");
      const data = await response.json();
      setQaTeamCount(data.length);
    } catch (error) {
      console.error("Error fetching QA team data:", error);
    }
  };

  useEffect(() => {
    fetchBatchCount();
    fetchQaRecordCount();
    fetchQaStandardCount();
    fetchQaTeamCount();
  }, []);

  return (
    <div className="p-5 text-center h-screen bg-[#58ab3114] rounded-lg">
      <h1 className="text-3xl sm:text-5xl md:text-7xl font-semibold tracking-wider text-[#11532F] leading-relaxed">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10 mt-10">
        <Link 
          to="/qa-manager/incoming-batches" 
          className="dashboard-item bg-[#58ab31] text-white p-5 sm:p-10 rounded-lg h-56 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg animate-fadeIn"
        >
          <h2 className="text-3xl sm:text-5xl text-white leading-relaxed">Incoming Batches</h2>
          <p className="text-xl sm:text-3xl text-black leading-relaxed">Total: {batchCount}</p>
        </Link>
        <Link 
          to="/qa-manager/qa-records" 
          className="dashboard-item bg-[#58ab31] text-white p-5 sm:p-10 rounded-lg h-56 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg animate-fadeIn"
        >
          <h2 className="text-3xl sm:text-5xl text-white leading-relaxed">QA Records</h2>
          <p className="text-xl sm:text-3xl text-black leading-relaxed">Total: {qaRecordCount}</p>
        </Link>
        <Link 
          to="/qa-manager/qa-standards" 
          className="dashboard-item bg-[#58ab31] text-white p-5 sm:p-10 rounded-lg h-56 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg animate-fadeIn"
        >
          <h2 className="text-3xl sm:text-5xl text-white leading-relaxed">QA Standards</h2>
          <p className="text-xl sm:text-3xl text-black leading-relaxed">Total: {qaStandardCount}</p>
        </Link>
        <Link 
          to="/qa-manager/qa-team" 
          className="dashboard-item bg-[#58ab31] text-white p-5 sm:p-10 rounded-lg h-56 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg animate-fadeIn"
        >
          <h2 className="text-3xl sm:text-5xl text-white leading-relaxed">QA Team Members</h2>
          <p className="text-xl sm:text-3xl text-black leading-relaxed">Total: {qaTeamCount}</p>
        </Link>
      </div>
    </div>
  );  
};

export default QADashboard;
