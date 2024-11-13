const router = require("express").Router();
const QualityStandard = require("../models/qaStandards");

// Add new quality standard
router.route("/add").post((req, res) => {
    const {
        vegetableType,
        gradeA,
        gradeB,
        gradeC
    } = req.body;

    const newQualityStandard = new QualityStandard({
        vegetableType,
        gradeA,
        gradeB,
        gradeC
    });

    newQualityStandard.save()
        .then(() => res.json("Quality Standard added"))
        .catch(err => {
            console.log(err);
            res.status(500).send({ status: "Error adding quality standard", error: err.message });
        });
});

// Get all quality standards
router.route("/").get((req, res) => {
    QualityStandard.find()
        .then(standards => res.json(standards))
        .catch(err => {
            console.log(err);
            res.status(500).send({ status: "Error fetching quality standards", error: err.message });
        });
});

// Update a quality standard by ID
router.route("/update/:id").put(async (req, res) => {
    const ID = req.params.id;
    const {
        vegetableType,
        gradeA,
        gradeB,
        gradeC
    } = req.body;

    const updateQualityStandard = {
        vegetableType,
        gradeA,
        gradeB,
        gradeC
    };

    try {
        await QualityStandard.findByIdAndUpdate(ID, updateQualityStandard);
        res.status(200).send({ status: "Quality Standard updated" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error updating quality standard", error: err.message });
    }
});

// Delete a quality standard by ID
router.route("/delete/:id").delete(async (req, res) => {
    const ID = req.params.id;

    try {
        await QualityStandard.findByIdAndDelete(ID);
        res.status(200).send({ status: "Quality Standard deleted" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error deleting quality standard", error: err.message });
    }
});

// Get quality standards by vegetable type
router.route("/vegetable/:vegetableType").get(async (req, res) => {
    const vegetableType = req.params.vegetableType;

    try {
        const standard = await QualityStandard.findOne({ vegetableType });
        res.status(200).send(standard);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error fetching quality standard", error: err.message });
    }
});

// Get a single quality standard by ID
router.route("/get/:id").get(async (req, res) => {
    const ID = req.params.id;

    try {
        const standard = await QualityStandard.findById(ID);
        res.status(200).send({ status: "Quality Standard fetched", standard });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error fetching quality standard", error: err.message });
    }
});

module.exports = router;
