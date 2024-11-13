    import React, { useState, useEffect } from "react";
    import axios from "axios";

    const UnitPrices = () => {
        const [unitPrices, setUnitPrices] = useState({
            Carrot: { gradeA: '', gradeB: '', gradeC: '' },
            Potato: { gradeA: '', gradeB: '', gradeC: '' },
            Leeks: { gradeA: '', gradeB: '', gradeC: '' },
            Cabbage: { gradeA: '', gradeB: '', gradeC: '' }
        });

        const vegEmojis = {
            Carrot: "🥕",
            Potato: "🥔",
            Leeks: "🥦",
            Cabbage: "🥬"
        };

        const handleInputChange = (vegType, value) => {
            const gradeA = parseFloat(value);
            const gradeB = (gradeA - (gradeA * 0.1)).toFixed(2);
            const gradeC = (gradeA - (gradeA * 0.2)).toFixed(2);

            setUnitPrices({
                ...unitPrices,
                [vegType]: { gradeA: value, gradeB, gradeC }
            });
        };

        const handleSubmit = async (vegType) => {
            const { gradeA } = unitPrices[vegType];

            try {
                await axios.post("http://localhost:3001/unitPrices/set-unit-price", { vegType, gradeA: parseFloat(gradeA) });
                alert("Unit price updated successfully.");

                // Directly update the state without re-fetching all
                setUnitPrices(prevPrices => ({
                    ...prevPrices,
                    [vegType]: {
                        ...prevPrices[vegType],
                        gradeA: parseFloat(gradeA).toFixed(2),
                        gradeB: (parseFloat(gradeA) - (parseFloat(gradeA) * 0.1)).toFixed(2),
                        gradeC: (parseFloat(gradeA) - (parseFloat(gradeA) * 0.2)).toFixed(2)
                    }
                }));
            } catch (error) {
                console.error("Error updating unit price:", error);
                alert("Failed to update unit price.");
            }
        };

        const fetchUnitPrices = async () => {
            try {
                const response = await axios.get("http://localhost:3001/unitPrices/get-unit-prices");
                const fetchedPrices = response.data.unitPrices.reduce((acc, curr) => {
                    acc[curr.vegType] = {
                        gradeA: curr.gradeA.toFixed(2),
                        gradeB: curr.gradeB.toFixed(2),
                        gradeC: curr.gradeC.toFixed(2)
                    };
                    return acc;
                }, { ...unitPrices }); // Include existing items in case of missing data

                setUnitPrices(fetchedPrices);
            } catch (error) {
                console.error("Error fetching unit prices:", error);
            }
        };

        useEffect(() => {
            fetchUnitPrices();
        }, []);

        return (
            <div className="m-3 bg-white p-6 rounded-lg shadow-md flex-auto max-w-6xl">
            <h1 className="text-4xl font-bold mb-5 ml-4 text-center">Unit Prices Per Kilogram</h1>
            <hr/>
            <div className="flex flex-wrap mt-5">
                {Object.keys(unitPrices).map(vegType => (
                    <div key={vegType} className="m-4 p-4 border rounded-md w-[47%] bg-white shadow-lg text-m border-gray-300">
                        <h3 className="text-2xl font-bold mb-4">{vegType} {vegEmojis[vegType]}</h3>
                        <hr></hr>
                        <label className="block mb-2 mt-4">Set the unit price for Grade A</label>
                        <div className="flex"> 
                            <input
                                type="number"
                                value={unitPrices[vegType].gradeA}
                                onChange={(e) => handleInputChange(vegType, e.target.value)}
                                className="block w-full h-12 border-1 border-gray-300 focus:outline-none focus:border-green-500 rounded-l-md px-3"
                            />
                            <span className="ml-0 flex items-center border-2 border-gray-300 border-l-0 text-gray-700 bg-gray-100 rounded-r-md p-1 font-semibold">Rs</span>
                        </div>
                        <div className="mt-5">
                            <p>Grade A Unit Price: <b>Rs. {unitPrices[vegType].gradeA}</b></p>
                            <p>Grade B Unit Price: <b>Rs. {unitPrices[vegType].gradeB}</b></p>
                            <p>Grade C Unit Price: <b>Rs. {unitPrices[vegType].gradeC}</b></p>
                        </div>
                        <button
                            onClick={() => handleSubmit(vegType)}
                            className="mt-10 bg-[#23b725] text-white p-2 pl-8 pr-8 rounded font-semibold hover:bg-green-500 transition duration-200"
                        >
                            Set Price
                        </button>
                    </div>
                ))}
            </div>
            </div>
        );
    };

    export default UnitPrices;
