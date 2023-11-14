const categorycollection = require('../../models/categorydb');
const { render } = require('ejs');
const productCollection = require('../../models/productdb');
const wishlistcollection = require('../../models/wishlistdb');
const { json } = require('express');

const addwish = async (req, res) => {
    const productId = req.body.product_id;
    const user = req.session.user;
    try{
       const check = await wishlistcollection.aggregate([{$match:{username:user}},{$unwind : "$product_id" },{$match:{product_id : productId}}]);
      
       if (check[0]) {
        res.status(200).json({msg : "found"});
       } else {
        try {
          await wishlistcollection.updateOne({ username: user }, { $push: { product_id: productId } }, { upsert: true });
          res.status(200).json({msg : "notfound"});
        } catch (error) {
          console.log("error in add to wishlist");
          console.log(error.message);
        }
       }
    }catch(err){
      console.log(err.message);
    }
  }
  
  const wishlist = async (req, res) => {
    const user = req.session.user;
    const logstatus = req.session.user ? "logout" : "login";
    try {
      const cat_data = await categorycollection.find();
      const wishlistdata = await wishlistcollection.find({ username: user });
      const product_id = wishlistdata[0].product_id;
      let productdata = await productCollection.find({ _id: { $in: product_id } });
      res.render('wishlist', { logstatus, wishlistdata: productdata, cat_data });
    } catch (error) {
      console.log("error in rendering wishlist");
      console.log(error.message);
    }
  }
  
  const removeWishlist = async (req, res) => {
    const productid = req.params.id;
    const user = req.session.user;
    try {
      await wishlistcollection.updateOne({ username: user }, { $pull: { product_id: productid } })
      res.redirect('back');
    } catch (error) {
      console.log("error in removing wishlist");
      console.log(error.message);
    }
  }

  module.exports = {
    addwish,
    wishlist,
    removeWishlist,
  }