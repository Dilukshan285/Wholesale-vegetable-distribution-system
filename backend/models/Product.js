const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { 
        type: String, required: true  
    },
    description: { 
        type: String, required: true 
    },  
    quantity: { 
        type: Number, required: true 
    },
    price: { 
        type: Number, required: true 
    },
    image: { 
        type: String 
    },
    discount: { 
        type: Number 
    },  
    category: { 
        type: String 
    },
    expDate: { 
        type: Date 
    },
     qrCode: {
    type: String
    }
});

const ProductModel = mongoose.model('GreenProduct', ProductSchema);
module.exports = ProductModel;
