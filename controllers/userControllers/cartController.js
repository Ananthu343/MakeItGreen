const categorycollection = require('../../models/categorydb');
const { render } = require('ejs');
const productCollection = require('../../models/productdb');
const cartcollection = require('../../models/cartdb');
const offercollection = require('../../models/offerdb');
const { json } = require('express');


const cart = async (req, res) => {
    try {
      const cat_data = await categorycollection.find();
      const logstatus = req.session.user ? "logout" : "login";
      const cartdata = await cartcollection.find({ userid: req.session.user });

      if (cartdata[0]) {
        let sum_subtotal = await cartcollection.aggregate([{ $match: { userid: req.session.user } }, { $group: { _id: null, sum: { $sum: "$subtotal" } } }]);
        sum_subtotal = sum_subtotal[0].sum;
        const shippingFee = 40;
        const totalAmount = sum_subtotal + shippingFee;
        res.render('cart', { logstatus, cartdata, sum_subtotal, shippingFee, totalAmount,cat_data });
      } else {
        sum_subtotal = "empty cart";
        const shippingFee = "empty cart";
        const totalAmount = "empty cart";
        res.render('cart', { logstatus, cartdata, sum_subtotal, shippingFee, totalAmount, cat_data });
      }
  
    } catch (error) {
      console.log(error.message);
      console.log("error in cart");
    }
}
  
  const addcart = async (req, res) => {
    const product_id = req.params.id;
    let cartdata = await cartcollection.find({ productid: product_id, userid: req.session.user });
    try {
      if (cartdata[0]) {
        let fixedPrice = cartdata[0].price;
        const product_data = await productCollection.findById(product_id);
        if (product_data.offer != 0 ) {
          const offerdata = await offercollection.find({productid : product_id});
          fixedPrice = offerdata[0].offerPrice;
        }
        let currentqty = cartdata[0].quantity;
        if(product_data.quantity > 0 && currentqty < product_data.quantity){
        currentqty++;
        const Subtotal = cartdata[0].subtotal;
        const newSubtotal = Subtotal + fixedPrice;  
        await cartcollection.updateOne({ productid: product_id, userid: req.session.user }, { $set: { quantity: currentqty, subtotal: newSubtotal } })
        }
        res.redirect('back');
      } else {
        const product_data = await productCollection.findById(product_id);
        let fixedPrice = product_data.price;
        if (product_data.offer != 0 ) {
          const offerdata = await offercollection.find({productid : product_id});
          fixedPrice = offerdata[0].offerPrice;
        }
        const cartitem = {
          userid: req.session.user,
          productid: product_id,
          productname: product_data.name,
          image_url: product_data.images[0],
          quantity: 1,
          price: fixedPrice,
          subtotal: fixedPrice
        }
        await cartcollection.insertMany([cartitem]);
        res.redirect('back');
      }
    } catch (error) {
      console.log(error.message);
      console.log("error adding product to cart");
    }
  }
  
  const removeproduct = async (req, res) => {
    const cartid = req.params.id;
    try {
      await cartcollection.findByIdAndDelete(cartid);
      res.redirect('back');
    } catch (error) {
      console.log("error deleting");
      console.log(error.message);
    }
  }
  
  const addQty = async (req, res) => {
    const cartid = req.body.id;
    try {
      const cartdata = await cartcollection.findById(cartid);
      const productid = cartdata.productid;
      const product_data = await productCollection.findById(productid);
      const fixedPrice = cartdata.price;
      let currentqty = cartdata.quantity;
      if(product_data.quantity > 0 && currentqty < product_data.quantity){
        currentqty++;
        const Subtotal = cartdata.subtotal;
        const newSubtotal = Subtotal + fixedPrice;
        await cartcollection.updateOne({ _id: cartid }, { $set: { quantity: currentqty, subtotal: newSubtotal } })
        res.json({ message: 'done' });
      }else{
        res.json({ message: 'noQty' });
      }
    } catch (error) {
      console.log(error.message);
      console.log("not adding qty");
    }
  }

  const subQty = async (req, res) => {
    const cartid = req.body.id;
    try {
      const cartdata = await cartcollection.findById(cartid);
      const fixedPrice = cartdata.price;
      let currentqty = cartdata.quantity;
  
      if (currentqty == 1) {
        await cartcollection.findByIdAndDelete(cartid);
      } else {
        currentqty--;
        const Subtotal = cartdata.subtotal;
        const newSubtotal = Subtotal - fixedPrice;
        await cartcollection.updateOne({ _id: cartid }, { $set: { quantity: currentqty, subtotal: newSubtotal } })
      }
      return res.status(200).send();
    } catch (error) {
      console.log(error.message);
      console.log("not subbing qty");
    }
  }
  
  const clearCart = async (req, res) => {
    try {
      await cartcollection.deleteMany({ userid: req.session.user });
      res.redirect('back');
    } catch (error) {
      console.log(error.message);
    }
  }

  module.exports = {
    cart,
    addcart,
    removeproduct,
    addQty,
    subQty,
    clearCart
  }