import React from "react";
const StatsCard = ({ title, value }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    );
  };
  
  export default StatsCard;
  