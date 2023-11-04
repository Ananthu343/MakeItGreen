var express = require('express');
const usercollection = require('../models/userdb');
const cartcollection = require('../models/cartdb');

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

async function cartempty(req,res,next) {
    try {
        const data = await cartcollection.findOne({userid : req.session.user});
        if (data) {
            next();
        }else {
            res.redirect('/cart');
        }
        
    } catch (error) {
        console.log("error checking cartempty");
        res.redirect('/cart');
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
router.get('/profile',authenticate,usercontroller.profile)
router.get('/profile/address',authenticate,usercontroller.profileaddress);
router.post('/addAddress',usercontroller.addAddress)
router.post('/updatedefaultaddress',usercontroller.updatedefaultaddress);
router.get('/deleteaddress/:id',usercontroller.deleteAddress);
router.get('/usereditprofile',authenticate,usercontroller.usereditprofile);
router.post('/saveuserprofile',usercontroller.saveuserprofile);
router.get('/checkout',cartempty,authenticate,usercontroller.checkout);
router.post('/confirmorder',usercontroller.confirmorder);
router.get('/confirmation',usercontroller.confirmation);
router.get('/profile/myorders',authenticate,usercontroller.myorders);
router.post('/cancelorder',usercontroller.cancelorder);
router.post('/addwish',authenticate,usercontroller.addwish);
router.get('/wishlist',authenticate,usercontroller.wishlist);
router.get('/removeWishlist/:id',authenticate,usercontroller.removeWishlist)
router.post('/applycoupon',authenticate,usercontroller.applycoupon);
router.get('/profile/wallet',authenticate,usercontroller.wallet);
router.post('/addwallet',authenticate,usercontroller.addwallet);
router.get('/specialoffers',usercontroller.specialoffers);
router.get('/logout',usercontroller.logout);



module.exports= router;