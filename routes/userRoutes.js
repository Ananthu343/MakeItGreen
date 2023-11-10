var express = require('express');
var router = express.Router();

const middleware = require('../middlewares/middlewares'); 
const userController = require('../controllers/userControllers/userController');
const cartController = require('../controllers/userControllers/cartController');
const checkoutController = require('../controllers/userControllers/checkoutController');
const couponController = require('../controllers/userControllers/couponController');
const otpController = require('../controllers/userControllers/otpController');
const profileController = require('../controllers/userControllers/profileController');
const wishlistController = require('../controllers/userControllers/wishlistController');


router.get('/login',userController.login);
router.post('/login',middleware.isitblocked,userController.loginPost);
router.get('/signup',userController.signup);
router.post('/signup',userController.signupPost);
router.get('/home',userController.home);
router.get('/forgotpass',userController.forgotpass);
router.post('/sendotp',otpController.forgotpasspost);
router.get('/resendotp/:email',otpController.resend);
router.get('/otpexpired/:email',otpController.otpexpired);
router.post('/confirmotp/:email',otpController.confirmotp);
router.post('/changepass/:email',otpController.changepass);
router.get('/category/:id',userController.categoryPage);
router.get('/productpage/:id',userController.product_page);
router.post('/searchfromuser',userController.search_product);
router.get('/cart',middleware.authenticate,cartController.cart);
router.get('/addcart/:id',middleware.authenticate,cartController.addcart);
router.get('/removecart/:id',cartController.removeproduct);
router.post('/addqty',cartController.addQty);
router.post('/subqty',cartController.subQty);
router.get('/clearcart',cartController.clearCart)
router.get('/profile',middleware.authenticate,profileController.profile)
router.get('/profile/address',middleware.authenticate,profileController.profileaddress);
router.post('/addAddress',profileController.addAddress)
router.post('/updatedefaultaddress',profileController.updatedefaultaddress);
router.get('/deleteaddress/:id',profileController.deleteAddress);
router.get('/usereditprofile',middleware.authenticate,profileController.usereditprofile);
router.post('/saveuserprofile',profileController.saveuserprofile);
router.get('/checkout',middleware.cartempty,middleware.authenticate,checkoutController.checkout);
router.post('/confirmorder',checkoutController.confirmorder);
router.get('/confirmation',checkoutController.confirmation);
router.get('/profile/myorders',middleware.authenticate,profileController.myorders);
router.post('/cancelorder',profileController.cancelorder);
router.post('/addwish',middleware.authenticate,wishlistController.addwish);
router.get('/wishlist',middleware.authenticate,wishlistController.wishlist);
router.get('/removeWishlist/:id',middleware.authenticate,wishlistController.removeWishlist)
router.post('/applycoupon',middleware.authenticate,couponController.applycoupon);
router.get('/cancelcoupon',couponController.cancelcoupon);
router.get('/profile/wallet',middleware.authenticate,profileController.wallet);
router.post('/addwallet',middleware.authenticate,profileController.addwallet);
router.get('/specialoffers',userController.specialoffers);
router.get('/logout',userController.logout);


module.exports= router;