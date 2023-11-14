const express = require('express');
const app = express();
const session = require('express-session')
const nocache = require('nocache');
const multer = require('multer')
require('dotenv').config();
const userrouter = require('./routes/userRoutes');
const adminrouter = require('./routes/adminRoutes');

const secretkey =  process.env.SECRET_KEY;

app.use(express.json());
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(nocache());

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Specify the destination folder
      },
      filename: (req, file, cb) => {
        // Generate a unique file name (you can use Date.now() or any other method)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      },
})

const filterFile =  (req,file,callback) =>{

    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        callback(null,true);
        console.log("filter passed");
    }else{
        callback(null,false);
        console.log("filter failed");

    }
}

app.use(multer({storage :fileStorage,fileFilter: filterFile}).array('imgfile', 4))
app.use(session({
    secret: secretkey,
    resave: false,
    saveUninitialized: true
}));
app.use("/",userrouter)
app.use("/",adminrouter)


app.listen(3000,()=>{
    console.log("Server running");
}); 