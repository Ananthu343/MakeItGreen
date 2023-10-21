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
router.get('/admin/usermanagement',authenticate,admincontroller.user_manage);
router.get('/block/:id',admincontroller.block);
router.get('/unblock/:id',admincontroller.unblock);
router.post('/search',admincontroller.search_user);
router.get('/admin/categorymanagement',authenticate,admincontroller.category_manage);
router.get('/deletecategory/:id',admincontroller.delete_category);
router.post('/addcategory',admincontroller.add_category);
router.get('/admin/productmanagement',authenticate,admincontroller.product_manage);
router.post('/addproduct',admincontroller.add_product)
router.post('/search/product',admincontroller.search_product);
router.get('/deleteproduct/:id',admincontroller.delete_product);
router.get('/editproduct/:id',admincontroller.edit_product);
router.get('/deleteimage/:index/:id',admincontroller.delete_image);
router.post('/editproduct/:id',admincontroller.update_product);
router.get('/admin/ordermanagement',admincontroller.order_manage);

module.exports= router;