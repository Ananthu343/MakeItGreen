const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    productid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productCollection'
    },
    offerPercent:{
        type: Number,
        required: true
    },
    offerPrice:{
        type: Number,
        required : true
    }
});

const offerCollection = new mongoose.model("offerCollection",offerSchema);

module.exports = offerCollection;