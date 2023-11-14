const usercollection = require('../../models/userdb');
const categorycollection = require('../../models/categorydb');
const { render } = require('ejs');
const productCollection = require('../../models/productdb');
const cartcollection = require('../../models/cartdb');
const addresscollection = require('../../models/addressdb');
const ordercollection = require('../../models/orderdb');
const walletcollection = require('../../models/walletdb');
const { json } = require('express');
const Razorpay = require('razorpay');

const keyId = process.env.RAZORPAY_ID_KEY;
const secretkey = process.env.RAZORPAY_SECRET_KEY;

const checkout = async (req, res) => {
    const logstatus = req.session.user ? "logout" : "login";
    const user = req.session.user;
    
    try {
      const cat_data = await categorycollection.find();
      const cartdata = await cartcollection.find({ userid: user });
      const discountval = cartdata[0].discount;
      let sum_subtotal = await cartcollection.aggregate([{ $match: { userid: user } }, { $group: { _id: null, sum: { $sum: "$subtotal" } } }]);
      let totalQty = await cartcollection.aggregate([{ $match: { userid: user } }, { $group: { _id: null, sum: { $sum: "$quantity" } } }]);
      totalQty = totalQty[0].sum;
      sum_subtotal = sum_subtotal[0].sum;
      const shippingFee = 40;
      let totalAmount = sum_subtotal + shippingFee;

      if (discountval) {
        totalAmount = totalAmount - discountval;
      }
      let userdata = await usercollection.find({ name: req.session.user });
      userdata = userdata[0];
      const addressdata = await addresscollection.find({ username: user });
      res.render('checkout', { logstatus, addressdata, userdata, totalQty, totalAmount, shippingFee, sum_subtotal, discountval, cat_data });
    } catch (error) {
      console.log("error in checkout");
      console.log(error.message);
    }
  }
  
  const confirmorder = async (req, res) => {
    const min = 1000000;
    const max = 9999999;
    const ordernumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let newday = day + 5;

    if (day ==26) {
      newday = 1;
    }else if (day==27) {
      newday = 2;
    }else if (day==28) {
      newday = 3;
    }else if (day==29) {
      newday = 4;
    }else if (day==30) {
      newday = 5;
    }else if (day==31) {
      newday = 6;
    }
    
    const expecteddate = newday + "/" + month + "/" + year;
    const currentdate = day + "/" + month + "/" + year;
    let flag = true;
    try {
      let products_name = await cartcollection.find({ userid: req.session.user }, { _id: 0, productname: 1 });
      let products_img = await cartcollection.find({ userid: req.session.user }, { _id: 0, image_url: 1 });
      let products_qty = await cartcollection.find({ userid: req.session.user }, { _id: 0, quantity: 1 });
      let products_subtotal = await cartcollection.find({ userid: req.session.user }, { _id: 0, subtotal: 1 });
  
      products_img = products_img.map((value) => {
        return value.image_url[0];
      })
      
      products_name = products_name.map((value) => {
        return value.productname;
      })
     
      products_qty = products_qty.map((value) => {
        return value.quantity;
      })
      
      products_subtotal = products_subtotal.map((value) => {
        return value.subtotal;
      })
      
      const orderdata = {
        userid: req.session.user,
        orderid: ordernumber,
        shippingAddress: req.body.shippingAddress,
        itemsname: products_name,
        itemsimage: products_img,
        paymentMode: req.body.paymentMode,
        status: "Confirmed",
        expectedBy: expecteddate,
        created_at : currentdate,
        subtotal: products_subtotal,
        quantity: products_qty
      }
      
      if (orderdata.paymentMode == "COD") {
        res.json({ message: 'COD' });
      } else if (orderdata.paymentMode == "ONLINE") {
        let amount = req.body.amount;
        let instance = new Razorpay({ key_id: keyId, key_secret: secretkey });
        let order = await instance.orders.create({
          amount: amount * 100,
          currency: "INR",
          receipt: "receipt1",
        })
        res.status(201).json({
          message: "ONLINE",
          order,
          amount,
          ordernumber
        })
      } else if (orderdata.paymentMode == "WALLET") {
        let amount = req.body.amount;
        try {
          const user = req.session.user;
          let userid = await usercollection.find({ name: user }, { _id: 1 });
          userid = userid[0]._id;
          let currentamt = await walletcollection.find({ userid: userid }, { balance: 1, _id: 0 });
          currentamt = currentamt[0].balance;
          if (amount <= currentamt) {
          let newAmt = currentamt - amount;  
          const method = "Debited";
          await walletcollection.updateOne({ userid: userid }, { balance: newAmt }, { upsert: true });
          await walletcollection.updateOne({ userid: userid }, { $push: { amountHistory: amount, date: currentdate, method: method } });
          res.json({ message: 'WALLET' });
          } else {
            flag = false;
            res.json({ message: 'InsufficientWallet' });
          }
        } catch (error) {
          console.log("error in using wallet purchase");
          console.log(error.message);
        } 
      }
      
      if (flag == true) {
        await ordercollection.insertMany([orderdata])

      // Stock managing
      try {
        for (let i = 0; i < products_name.length; i++) {
          const productName = products_name[i];
          const productsQty = products_qty[i];
          const data = await productCollection.find({ name: productName });
          const currentqty = data[0].quantity;
          const newQty = currentqty - productsQty;
          await productCollection.updateOne({ name: productName }, { $set: { quantity: newQty } });
        }
      } catch (error) {
        console.log("error in stock manage");
        console.log(error.message);
      }
      await cartcollection.deleteMany({ userid: req.session.user });
      }
    } catch (error) {
      console.log("Error in adding order db");
      console.log(error.message);
    }
  }
  
  const confirmation = async (req, res) => {
    try {
      const order = await ordercollection.find({ userid: req.session.user });
      const lastElement = order.length - 1;
      const orderid = order[lastElement].orderid;
      res.render('orderconfirmpage', { orderid: orderid });
    } catch (error) {
      console.log(error.message);
      console.log("error in confirmation page");
    }
  
  }

  module.exports = {
    checkout,
    confirmorder,
    confirmation
  }