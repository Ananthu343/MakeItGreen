const mongoose = require('mongoose');


const addressSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    pincode:{
        type:Number,
        required:false
    },
    city:{
        type:String,
        required:false
    },
    state:{
        type:String,
        required:false
    }
});

const addresscollection = new mongoose.model("addresscollection",addressSchema);//creating collection

module.exports=addresscollection;