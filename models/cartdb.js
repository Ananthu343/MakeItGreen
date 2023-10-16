const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userid:{
       type: String,
       required:true
    },
    productid :{
        type:String,
        required : true
    },
    productname :{
        type:String,
        required : true
    },
    image_url:[{
        type: String,
        required: false
    }],
    quantity :{
        type :Number,
        required : true
    },
    price :{
        type:Number,
        required:true
    },
    subtotal: {
        type: Number,
        required:true
    }
})

const cartcollection = new mongoose.model("cartcollection",cartSchema);

module.exports = cartcollection;