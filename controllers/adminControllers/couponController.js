
const couponcollection = require('../../models/coupondb');

const coupon_manage = async (req, res) => {
    try {
        const fulldata = await couponcollection.find();
        res.render('couponmanagement', { fulldata });
    } catch (error) {
        console.log("error in coupon manage");
        console.log(error.message);
    }
}

const add_coupon = async (req, res) => {
    const coupondata = {
        code: req.body.couponcode,
        discountValue: req.body.discountval,
        minPurchase: req.body.minimumpurchase
    }
    try {
        await couponcollection.insertMany([coupondata]);
        res.redirect('/admin/couponmanagement');
    } catch (error) {
        console.log("error in adding coupon");
        console.log(error.message);
    }
}

const delete_coupon = async (req, res) => {
    const couponId = req.params.id;
    try {
        await couponcollection.findByIdAndDelete(couponId);
        res.redirect('/admin/couponmanagement');
    } catch (error) {
        console.log("error in deleting coupon");
        console.log(error.message);
    }
}


module.exports = {
    coupon_manage,
    add_coupon,
    delete_coupon
}