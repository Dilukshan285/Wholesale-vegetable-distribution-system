const PriceChart = ({ basePrice }) => {
  // Static discount values
  const discounts = [
    { quantity: "10 kg - 25 kg", discount: 5 },
    { quantity: "26 kg - 50 kg", discount: 7 },
    { quantity: "51 kg - 100 kg", discount: 11 },
    { quantity: "101 kg and above", discount: 14 }
  ];

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  return (
    <table className="mt-2 w-full border border-gray-300 text-sm rounded-lg">
      <thead>
        <tr>
          <th className="border-b border-r border-gray-300 py-2 px-4 text-left">Quantity</th>
          <th className="border-b border-r border-gray-300 py-2 px-4 text-left">Discount</th>
          <th className="border-b py-2 px-4 text-left">Unit Price</th>
        </tr>
      </thead>
      <tbody>
        {discounts.map((item, index) => (
          <tr key={index}>
            <td className="border-b border-r border-gray-300 py-2 px-4">{item.quantity}</td>
            <td className="border-b border-r border-gray-300 py-2 px-4 text-center">{item.discount}%</td>
            <td className="border-b py-2 px-4">
              Rs {calculateDiscountedPrice(basePrice, item.discount).toFixed(0)}.00
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PriceChart;
