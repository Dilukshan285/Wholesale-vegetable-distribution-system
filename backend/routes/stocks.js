const router = require("express").Router();
const Stock = require("../models/Stock");

//update total quantity
const updateTotalQuantity = async (vegType, quantityChange) => {
    const stocks = await Stock.find({ vegType });
    const totalQuantity = stocks.reduce((sum, stock) => sum + stock.quantity, 0);

    await Stock.updateMany({ vegType }, { totalQuantity });
};

// Add stock
router.route("/add-stocks").post((req, res) => {
    const { vegType, qualityGrade, batchNumber, quantity, expDate } = req.body;
    const dateAdded = new Date(); // Adding the current date

    const newStock = new Stock({
        vegType,
        qualityGrade,
        batchNumber,
        quantity,
        expDate,
        dateAdded
    });

    newStock.save()
        .then(() => res.status(200).send({ status: "Stock Added" }))
        .catch(err => res.status(500).send({ status: "Error Adding Stock", error: err }));
});

// Display all stocks
router.route("/all-stocks").get(async (req, res) => {
    try {
        const stocks = await Stock.find();

        // Initialize totalQuantities object
        const totalQuantities = {
            Carrot: { A: 0, B: 0, C: 0 },
            Potato: { A: 0, B: 0, C: 0 },
            Cabbage: { A: 0, B: 0, C: 0 },
            Leeks: { A: 0, B: 0, C: 0 }
        };

        // Calculate total quantities by vegType and qualityGrade
        stocks.forEach(stock => {
            totalQuantities[stock.vegType][stock.qualityGrade] += stock.quantity;
        });

        res.status(200).send({ status: "Stocks Displayed", stocks, totalQuantities });
    } catch (err) {
        res.status(500).send({ status: "Error Fetching Stocks", error: err });
    }
});

// Update stock
router.put("/update/:stockId", async (req, res) => {
    const stockId = req.params.stockId;
    const { vegType, qualityGrade, batchNumber, quantity, expDate } = req.body;

    try {
        const stock = await Stock.findById(stockId);
        if (!stock) {
            return res.status(404).send({ status: "Stock not found" });
        }

        const quantityChange = quantity - stock.quantity; // Difference in quantities

        // Update the stock
        await Stock.findByIdAndUpdate(stockId, { vegType, qualityGrade, batchNumber, quantity, expDate });
        await updateTotalQuantity(vegType, quantityChange);

        res.status(200).send({ status: "Stock Updated" });
    } catch (err) {
        console.error("Error updating stock:", err.message);
        res.status(500).send({ status: "Error updating stock", error: err.message });
    }
});

// Remove stock
router.delete("/delete/:stockId", async (req, res) => {
    const stockId = req.params.stockId;

    try {
        const stock = await Stock.findById(stockId);
        if (!stock) {
            return res.status(404).send({ status: "Stock not found" });
        }

        // Remove the stock and update total quantity
        await Stock.findByIdAndDelete(stockId);
        await updateTotalQuantity(stock.vegType, -stock.quantity);

        res.status(200).send({ status: "Stock Removed" });
    } catch (err) {
        console.error("Error removing stock:", err.message);
        res.status(500).send({ status: "Error removing stock", error: err.message });
    }
});

// Remove specific quantity of a stock based on vegType and qualityGrade
router.put("/remove-stock", async (req, res) => {
    const { vegType, qualityGrade, amount } = req.body;

    try {
        // Find all stocks of the specified vegType and qualityGrade
        const stocks = await Stock.find({ vegType, qualityGrade });
        if (!stocks.length) {
            return res.status(404).send({ status: "No stock found for the specified type and grade" });
        }

        let remainingAmount = amount;

        // Update stocks and remove the specified amount
        for (let stock of stocks) {
            if (remainingAmount <= 0) break;

            if (stock.quantity >= remainingAmount) {
                stock.quantity -= remainingAmount;
                remainingAmount = 0;
            } else {
                remainingAmount -= stock.quantity;
                stock.quantity = 0;
            }

            await stock.save();
        }

        if (remainingAmount > 0) {
            return res.status(400).send({ status: "Insufficient stock to remove the requested amount" });
        }

        await updateTotalQuantity(vegType, -amount); // Update total quantity
        res.status(200).send({ status: "Stock removed successfully" });
    } catch (err) {
        console.error("Error removing stock:", err.message);
        res.status(500).send({ status: "Error removing stock", error: err.message });
    }
});

// Fetch a stock by ID
router.get("/get/:stockId", async (req, res) => {
    const stockId = req.params.stockId;

    try {
        const stock = await Stock.findById(stockId);
        if (!stock) {
            return res.status(404).send({ status: "Stock not found" });
        }
        res.status(200).send({ status: "Stock Fetched", stock });
    } catch (err) {
        console.error("Error fetching stock:", err.message);
        res.status(500).send({ status: "Error fetching stock", error: err.message });
    }
});

module.exports = router;
