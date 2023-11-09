const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    orderid:{
        type:String,
        required:true
    },
    shippingAddress:{
        type:String,
        required:true
    },
    itemsname:[{
        type:String,
        required:true
    }],
    itemsimage:[{
        type:String,
        required:true
    }],
    paymentMode:{
        type:String,
        required:false
    },
    status:{
        type:String,
        required:true
    },
    expectedBy:{
        type:String,
        required:false
    },
    created_at:{
        type:String,
        required:true
    },
    subtotal: [{
        type: Number,
        required:true
    }],
    quantity :[{
        type :Number,
        required : true
    }],
});

const ordercollection = new mongoose.model("ordercollection",orderSchema);//creating collection

module.exports=ordercollection;