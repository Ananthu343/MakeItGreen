var express = require('express');
var router = express.Router();

const adminController = require('../controllers/adminControllers/adminController');
const bannerController = require('../controllers/adminControllers/bannerController');
const categoryController = require('../controllers/adminControllers/categoryController');
const couponController = require('../controllers/adminControllers/couponController');
const orderController = require('../controllers/adminControllers/orderController');
const productController = require('../controllers/adminControllers/productController');
const userManage = require('../controllers/adminControllers/userManage');
const salePdfController = require('../controllers/adminControllers/salePdfController');


function authenticate(req, res, next) {
    console.log("authenticating");
    if (!req.session.admin) {
        return res.redirect('/adminlogin');
    }
    next();
}

router.get('/adminlogin',adminController.adlogin);
router.post('/admin',adminController.adloginpost);
router.get('/adlogout',adminController.adlogout);
router.get('/admin/dashboard',authenticate,adminController.dashboard);
router.get('/admin/usermanagement',authenticate,userManage.user_manage);
router.get('/block/:id',authenticate,userManage.block);
router.get('/unblock/:id',authenticate,userManage.unblock);
router.post('/search',authenticate,userManage.search_user);
router.get('/admin/categorymanagement',authenticate,categoryController.category_manage);
router.get('/deletecategory/:id',authenticate,categoryController.delete_category);
router.post('/addcategory',authenticate,categoryController.add_category);
router.get('/admin/productmanagement',authenticate,productController.product_manage);
router.post('/addproduct',authenticate,productController.add_product)
router.post('/search/product',authenticate,productController.search_product);
router.get('/deleteproduct/:id',authenticate,productController.delete_product);
router.get('/editproduct/:id',authenticate,productController.edit_product);
router.get('/deleteimage/:index/:id',authenticate,productController.delete_image);
router.post('/editproduct/:id',authenticate,productController.update_product);
router.get('/admin/ordermanagement',authenticate,orderController.order_manage);
router.post('/confirmuserorder',authenticate,orderController.confirmorder);
router.post('/deliveredorder',authenticate,orderController.deliveredorder);
router.post('/pendingorder',authenticate,orderController.pendingorder);
router.get('/admin/bannermanagement',authenticate,bannerController.banner_manage);
router.post('/addbanner',authenticate,bannerController.add_banner);
router.get('/editbanner/:id',authenticate,bannerController.edit_banner);
router.post('/editbanner/:id',authenticate,bannerController.update_banner);
router.get('/delete_bannerimg/:index/:id',authenticate,bannerController.delete_bannerimg)
router.get('/deletebanner/:id',authenticate,bannerController.delete_banner);
router.get('/admin/couponmanagement',authenticate,couponController.coupon_manage);
router.post('/addcoupon',authenticate,couponController.add_coupon);
router.get('/deletecoupon/:id',authenticate,couponController.delete_coupon);
router.get('/download-sales-report',authenticate,salePdfController.sale_report);


module.exports= router;