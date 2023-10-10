const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    images:[{
        type: String,
        required: false
    }],
    description:{
        type: String,
        required: false
    },
    price:{
        type: Number,
        required: false
    },
    quantity:{
        type: Number,
        required: false
    },
    category:{
        type: String,
        required: false
    },
    offer:{
        type: Number,
        required: false
    },
});

const productCollection = new mongoose.model("productCollection",productSchema);

module.exports = productCollection;