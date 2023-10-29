const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true
    },
    discountValue:{
        type: Number,
        required: true
    }
});

const couponCollection = new mongoose.model("couponCollection",couponSchema);

module.exports = couponCollection;