const { render } = require('ejs');
const cartcollection = require('../../models/cartdb');
const { json } = require('express');
const couponCollection = require('../../models/coupondb');

const applycoupon = async (req, res) => {
    const code = req.body.couponcode;
    const purcahseAmount = req.body.amount;
    let shippingfee = 40;
    try {
      const coupondata = await couponCollection.find({ code: code });
      const discount = coupondata[0].discountValue;
      const minPurchase = coupondata[0].minPurchase;
      if(purcahseAmount >= minPurchase){
        await cartcollection.updateOne({ userid: req.session.user }, { $set: { discount: discount } })
        let sum_subtotal = await cartcollection.aggregate([{ $match: { userid: req.session.user } }, { $group: { _id: null, sum: { $sum: "$subtotal" } } }]);
        sum_subtotal = sum_subtotal[0].sum + shippingfee;
        const totalAmount = sum_subtotal - discount;
        res.status(200).json({ value: discount, amount: totalAmount });
      }else{
        res.status(200).json({ value: "minAmountRequired" });
      }
    } catch (error) {
      res.status(200).json({ value: "null" });
      // console.log('coupon apply failed');
      // console.log(error.message);
    }
  }
  
  const cancelcoupon = async(req,res)=>{
    try {
      await cartcollection.updateOne({ userid: req.session.user }, { $unset: { discount: "" } });
      res.status(200).json({cancel : "done"});
    } catch (error) {
      console.log('Error in canceling coupn');
    }
  }

  module.exports = {
    applycoupon,
    cancelcoupon
  }
  