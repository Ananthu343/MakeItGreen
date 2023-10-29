const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    product_id:[{
        type: String,
        required: true
    }]
});

const wishlistCollection = new mongoose.model("wishlistCollection",wishlistSchema);

module.exports = wishlistCollection;