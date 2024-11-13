// src/components/Dashboard/StatBox.js
import React from 'react';

const StatBox = ({ title, value }) => {
  return (
    <div className="stat-box">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default StatBox;
