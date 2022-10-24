const mongoose = require('mongoose');

const product = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image:{
        type:String
    }
});


const Products = new mongoose.model('Products', product);
module.exports = Products;
