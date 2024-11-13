import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockBarChart from './StockBarChart';

export default function AllStock() {
  const [stocks, setStocks] = useState([]);
  const [totalQuantities, setTotalQuantities] = useState({});

  useEffect(() => {
    function getStocks() {
      axios.get("http://localhost:3001/stock/all-stocks")
        .then(res => {
          setStocks(res.data.stocks);
          setTotalQuantities(res.data.totalQuantities);
        })
        .catch(err => console.log(err));
    }
    getStocks();
  }, []);

  return (
    <div className="m-3 bg-white p-6 rounded-lg shadow-md flex-auto max-w-6xl">
    <div>
      <h1 className="text-4xl font-bold text-center mb-1">Inventory Stock Levels</h1>
      <div className="overflow-x-auto">
        <hr className="my-4" />
        {stocks.length > 0 ? (
          <>
            {/* Bar Chart for stock levels */}
            <StockBarChart totalQuantities={totalQuantities} />
          </>
        ) : (
          <p className="text-center text-gray-500 mt-6">Inventory is empty.</p>
        )}
      </div>
    </div>
    </div>
  );
}
