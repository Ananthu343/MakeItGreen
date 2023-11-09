var express = require('express');
var router = express.Router();

const admincontroller = require('../controllers/admincontroller');

function authenticate(req, res, next) {
    console.log("authenticating");
    if (!req.session.admin) {
        return res.redirect('/adminlogin');
    }
    next();
}

router.get('/adminlogin',admincontroller.adlogin);
router.post('/admin',admincontroller.adloginpost);
router.get('/adlogout',admincontroller.adlogout);
router.get('/admin/dashboard',authenticate,admincontroller.dashboard);
router.get('/admin/usermanagement',authenticate,authenticate,admincontroller.user_manage);
router.get('/block/:id',authenticate,admincontroller.block);
router.get('/unblock/:id',authenticate,admincontroller.unblock);
router.post('/search',authenticate,admincontroller.search_user);
router.get('/admin/categorymanagement',authenticate,admincontroller.category_manage);
router.get('/deletecategory/:id',authenticate,admincontroller.delete_category);
router.post('/addcategory',authenticate,admincontroller.add_category);
router.get('/admin/productmanagement',authenticate,admincontroller.product_manage);
router.post('/addproduct',authenticate,admincontroller.add_product)
router.post('/search/product',authenticate,admincontroller.search_product);
router.get('/deleteproduct/:id',authenticate,admincontroller.delete_product);
router.get('/editproduct/:id',authenticate,admincontroller.edit_product);
router.get('/deleteimage/:index/:id',authenticate,admincontroller.delete_image);
router.post('/editproduct/:id',authenticate,admincontroller.update_product);
router.get('/admin/ordermanagement',authenticate,admincontroller.order_manage);
router.post('/confirmuserorder',authenticate,admincontroller.confirmorder);
router.post('/deliveredorder',authenticate,admincontroller.deliveredorder);
router.post('/pendingorder',authenticate,admincontroller.pendingorder);
router.get('/admin/bannermanagement',authenticate,admincontroller.banner_manage);
router.post('/addbanner',authenticate,admincontroller.add_banner);
router.get('/editbanner/:id',authenticate,admincontroller.edit_banner);
router.post('/editbanner/:id',authenticate,admincontroller.update_banner);
router.get('/delete_bannerimg/:index/:id',authenticate,admincontroller.delete_bannerimg)
router.get('/deletebanner/:id',authenticate,admincontroller.delete_banner);
router.get('/admin/couponmanagement',authenticate,admincontroller.coupon_manage);
router.post('/addcoupon',authenticate,admincontroller.add_coupon);
router.get('/deletecoupon/:id',authenticate,admincontroller.delete_coupon);


module.exports= router;