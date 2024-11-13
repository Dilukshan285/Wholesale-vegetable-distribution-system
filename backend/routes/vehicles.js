const router = require('express').Router();
let Vehicle = require('../models/Vehicle');


router.route('/add').post((req, res) =>{
    const registrationNo = req.body.registrationNo;
    const manufacYear = req.body.manufacYear;
    const mileage = Number(req.body.mileage);
    const length = Number(req.body.length);
    const width = Number(req.body.width);
    const driverNic = req.body.driverNic;
    

    const newVehicle = new Vehicle({
        registrationNo,
        manufacYear,
        mileage,
        length,
        width,
        driverNic
        

    })

    newVehicle.save().then(()=> {
        res.json("Vehicle added");
    }).catch(err =>{
        console.log(err);
        
    })

})

router.route("/").get((req, res)=> {
    Vehicle.find().then((vehicles)=>{
        res.json(vehicles)
    }).catch((err)=>{
        console.log(err);
    })
})


router.route("/update/:vehicleid").put(async(req, res) => {
    let vehicleId = req.params.vehicleid;
    const {registrationNo,manufacYear,length,width,driverNic} = req.body;

    const updateVehicle = {
        registrationNo,
        manufacYear,
        length,
        width,
        driverNic
    };

    try {
        const update = await Vehicle.findByIdAndUpdate(vehicleId, updateVehicle, { new: true });
        if (update) {
            res.status(200).send({ status: 'updated', vehicle: update });
        } else {
            res.status(404).send({ status: 'Vehicle not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 'Error with updating', error: err.message });
    }
});


router.route("/delete/:vehicleid").delete(async (req, res) => {
    let userId = req.params.vehicleid; 

    await Vehicle.findByIdAndDelete(userId).then(() => {
        res.status(200).send({status:'success'});
    }).catch(err => {
        console.log(err);
        res.status(500).send({status:'error'});
    })
})

module.exports = router;