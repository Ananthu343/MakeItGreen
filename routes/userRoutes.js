var express = require('express');
const usercollection = require('../models/userdb');
var router = express.Router();

const usercontroller = require('../controllers/usercontroller');

async function isitblocked(req,res,next) {
    try {
        // console.log(req.body);
        const data = await usercollection.findOne({name:req.body.name});
        if (data.block_status == "blocked") {
            console.log("blocked aanu");
            res.render('userlogin',{message:"Account blocked by admin!"});
        }else {
            next();
        }
        
    } catch (error) {
        console.log("error checking blocked");
        // next()
    }
}

function authenticate(req, res, next) {
    console.log("authenticating");
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

router.get('/login',usercontroller.login);
router.post('/login',isitblocked,usercontroller.loginPost);
router.get('/signup',usercontroller.signup);
router.post('/signup',usercontroller.signupPost);
router.get('/home',usercontroller.home);
router.get('/forgotpass',usercontroller.forgotpass);
router.post('/sendotp',usercontroller.forgotpasspost);
router.get('/resendotp/:email',usercontroller.resend);
router.get('/otpexpired/:email',usercontroller.otpexpired);
router.post('/confirmotp/:email',usercontroller.confirmotp);
router.post('/changepass/:email',usercontroller.changepass);
router.get('/category/:id',usercontroller.categoryPage);
router.get('/productpage/:id',usercontroller.product_page);
router.post('/searchfromuser',usercontroller.search_product);
router.get('/cart',authenticate,usercontroller.cart);
router.get('/addcart/:id',authenticate,usercontroller.addcart);
router.get('/removecart/:id',usercontroller.removeproduct);
router.post('/addqty',usercontroller.addQty);
router.post('/subqty',usercontroller.subQty);
router.get('/clearcart',usercontroller.clearCart)
router.get('/profile',usercontroller.profile)

router.get('/logout',usercontroller.logout);



module.exports= router;