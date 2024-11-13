const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const farmerSchema = new Schema({

    firstName : {
        type : String,
        required:true
    },
    
    lastName : {
        type : String,
        required:true
    },

    DOB : {
        type : Date,
        required:true
    },

    age : {
        type : Number,
        required:true
    },
    gender : {
        type : String,
        required:true
    },

    NIC : {
        type:String,
        required:true,
        unique : true
    },

    address :{
        type : String,
        required:true
    },

    email :{
        type : String,
        required:true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email address",
          ]
    },

    contact :{
        type:String,
        required:true
    },

    password : {
        type:String,
        required:true
    }

     


})







const Farmer = mongoose.model("Farmer", farmerSchema);

module.exports = Farmer;
