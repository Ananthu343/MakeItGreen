const express = require('express');
const app = express();
const session = require('express-session')
const nocache = require('nocache');
require('dotenv').config();

const secretkey =  process.env.SECRET_KEY;


const userrouter = require('./routes/userRoutes');
const adminrouter = require('./routes/adminRoutes');


app.use(express.json());
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(nocache());

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