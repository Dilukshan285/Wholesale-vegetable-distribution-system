const router = require("express").Router();
let StaffMember = require("../models/StaffMember.js")

//add staff
router.route("/add-staff").post((req,res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const gender = req.body.gender;
    const nic = req.body.nic;
    const email = req.body.email;
    const address = req.body.address;
    const district = req.body.district;
    const contactNumber = req.body.contactNumber;
    const dob = req.body.dob;
    const role = req.body.role;

    const newStaffMember = new StaffMember({
        firstName,
        lastName,
        gender,
        nic,
        email,
        address,
        district,
        contactNumber,
        dob,
        role
    })

    newStaffMember.save().then(() => {
        res.status(200).send({status: "Staff Added"});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "An error occured while adding the staff"})
    })
})

//Display staff
router.route("/all-staff").get((req,res) => {
    StaffMember.find().then((staffMembers) => {
        res.status(200).send({status: "Staff Displayed", staffMembers});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "An error occured while displaying the staff"});
    })
})

//Update staff
router.route("/update-staff/:id").put(async (req,res) => {
    let staffId = req.params.id;
    const {firstName, lastName, gender, nic, email, address, district, contactNumber, dob, role} = req.body;

    const updateStaff = {
        firstName,
        lastName,
        gender,
        nic,
        email,
        address,
        district,
        contactNumber,
        dob,
        role
    }

    const update = await StaffMember.findByIdAndUpdate(staffId, updateStaff).then(() => {
        res.status(200).send({status: "Staff Updated"});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "An error occured while updating the staff"});
    })
})

//Remove staff
router.route("/delete/:id").delete(async (req,res) => {
    let staffId = req.params.id;

    await StaffMember.findByIdAndDelete(staffId).then(() => {
        res.status(200).send({status: "Staff Removed"});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "An error occured while removing the staff"});
    })
})

//Fetch a staff member
router.route("/get-staff/:id").get(async (req,res) => {
    let staffId = req.params.id;

    const staff = await StaffMember.findById(staffId).then((staff) => {
        res.status(200).send({status: "Staff Fetched", staff});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "An error occured while fetching the staff"});
    })
})

module.exports = router;