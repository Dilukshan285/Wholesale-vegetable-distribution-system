const ProductModel = require('../models/Product');

const uploadImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        
        const { name, description, quantity, price, discount, category, expDate, qrCode } = req.body;

        
        ProductModel.create({
            name,
            description,
            quantity,
            price,
            image: req.file.filename, 
            discount,
            category,
            expDate,
            qrCode 
        })
        .then(result => res.json(result))
        .catch(err => {
            console.error('Error saving product:', err);
            res.status(500).send('Error saving product.');
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send('Server encountered an error.');
    }
};




const getAllImages = (req, res) => {
    ProductModel.find()
        .then(products => res.json(products))
        .catch(err => res.status(500).send(err));
};


const updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, description, quantity, price, discount, category, expDate } = req.body;

    
    const updateData = { name, description, quantity, price, discount, category, expDate };

    
    if (req.file) {
        updateData.image = req.file.filename; 
    }

    ProductModel.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true } 
    )
    .then(result => {
        if (!result) {
            return res.status(404).send('Product not found.');
        }
        res.json(result);
    })
    .catch(err => {
        console.error('Error updating product:', err);
        res.status(500).send('Error updating product.');
    });
};


const deleteProduct = (req, res) => {
    const { id } = req.params;

    ProductModel.findByIdAndDelete(id)
        .then(result => {
            if (!result) {
                return res.status(404).send('Product not found.');
            }
            res.json({ message: 'Product deleted successfully' });
        })
        .catch(err => {
            console.error('Error deleting product:', err);
            res.status(500).send('Error deleting product.');
        });
};

module.exports = { uploadImage, getAllImages, updateProduct, deleteProduct };
