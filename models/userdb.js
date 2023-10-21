const mongoose = require('mongoose');
const dburl = process.env.DB_URL

mongoose.connect(dburl)
.then(()=>{
    console.log("mongo connected");
})
.catch((err)=>{
    console.log(err.message);
    console.log("failed to connect");
});

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:false
    },
    otpExpires:{
        type:Number,
        required:false
    },
    created_at:{
        type:Date,
        required:false
    },
    block_status:{
        type:String,
        required:false
    },
    image_url:[{
        type: String,
        required: false
    }],
    defaultAddress:{
        type:String,
        required:false
    }
});

const usercollection = new mongoose.model("usercollection",userSchema);//creating collection

module.exports=usercollection;