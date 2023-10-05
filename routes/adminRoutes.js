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
router.get('/admin/usermanagement',admincontroller.user_manage);
router.get('/block/:id',admincontroller.block);
router.get('/unblock/:id',admincontroller.unblock);
router.post('/search',admincontroller.search_user);
router.get('/admin/categorymanagement',admincontroller.category_manage);
router.get('/deletecategory/:id',admincontroller.delete_category);
router.post('/addcategory',admincontroller.add_category);

module.exports= router;