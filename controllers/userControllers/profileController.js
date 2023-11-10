const usercollection = require('../../models/userdb');
const categorycollection = require('../../models/categorydb');
const { render } = require('ejs');
const productCollection = require('../../models/productdb');
const addresscollection = require('../../models/addressdb');
const ordercollection = require('../../models/orderdb');
const walletcollection = require('../../models/walletdb');
const { json } = require('express');
const Razorpay = require('razorpay');

const keyId = process.env.RAZORPAY_ID_KEY;
const secretkey = process.env.RAZORPAY_SECRET_KEY;


const profile = async (req, res) => {
    const username = req.session.user;
    const logstatus = req.session.user ? "logout" : "login";
    console.log(username);
    try {
      const cat_data = await categorycollection.find();
      let userdata = await usercollection.find({ name: username });
      // console.log(userdata);
      userdata = userdata[0];
      res.render('userprofile', { logstatus, userdata, cat_data });
    } catch (error) {
      console.log("error log profile");
    }
  
  }
  
  const profileaddress = async (req, res) => {
    const logstatus = req.session.user ? "logout" : "login";
    console.log(req.session.user);
    try {
      const cat_data = await categorycollection.find();
      let userdata = await usercollection.find({ name: req.session.user })
      const addressdata = await addresscollection.find({ username: req.session.user });
      userdata = userdata[0];
      // console.log(userdata);
      res.render('profileaddress', { logstatus, userdata, addressdata, cat_data })
    } catch (error) {
      console.log(error.message);
    }
  }
  
  
  
  const addAddress = async (req, res) => {
    const username = req.session.user;
    const fullname = req.body.firstName + " " + req.body.lastName;
    const data = {
      username: username,
      address: req.body.address,
      phone: req.body.mobile,
      pincode: req.body.pin,
      city: req.body.city,
      name: fullname,
      state: req.body.state
    }
    console.log(data);
    try {
      if (username != undefined) {
        await addresscollection.insertMany([data]);
        res.redirect('back');
      }
  
    } catch (error) {
      console.log("error adding address");
      console.log(error.message);
      res.redirect('/login');
    }
  }
  
  const updatedefaultaddress = async (req, res) => {
    const addressid = req.body.choice;
    const username = req.session.user;
    try {
      const addressdata = await addresscollection.findById(addressid);
      const fullAddress = addressdata.name + ", " + addressdata.address + ", " + addressdata.city + ", " + addressdata.state + ", " + "Pin code : " + addressdata.pincode + "   Mobile : " + addressdata.phone;
      console.log(fullAddress);
      await usercollection.updateOne({ name: username }, { $set: { defaultAddress: fullAddress } });
      return res.status(200).send('updation done')
    } catch (error) {
      console.log("error in defaultaddress");
      console.log(error.message);
    }
  }
  
  const deleteAddress = async (req, res) => {
    const addressid = req.params.id;
    try {
      await addresscollection.findByIdAndDelete(addressid);
      res.redirect('back');
    } catch (error) {
      console.log("unable to delete");
      console.log(error.message);
    }
  }
  
  const usereditprofile = async (req, res) => {
    const logstatus = req.session.user ? "logout" : "login";
    // console.log("worked");
    try {
      const cat_data = await categorycollection.find();
      let userdata = await usercollection.find({ name: req.session.user });
      userdata = userdata[0];
      console.log(userdata);
      res.render('profileEdit', { userdata, logstatus, cat_data })
    } catch (error) {
  
    }
  }
  
  const saveuserprofile = async (req, res) => {
    const username = req.session.user;
    try {
      let imagePath = req.files[0].path;
      // console.log(imagePath);
      // Check if the path includes "public/" (Windows uses backslashes)
      if (imagePath.includes('public\\')) {
        // Remove the "public/" prefix for Windows
        imagePath = imagePath.replace('public\\', '');
      } else if (imagePath.includes('public/')) {
        // Remove the "public/" prefix for Unix-like systems
        imagePath = imagePath.replace('public/', '');
      }
      const newdata = {
        name: req.body.name,
        email: req.body.email,
        defaultAddress: req.body.address,
        image_url: imagePath
      }
      // console.log(newdata);
      await usercollection.updateOne({ name: username }, { $set: newdata });
      res.redirect('/profile');
    } catch (error) {
      console.log("error saving profile");
      console.log(error.message);
    }
  }

  const myorders = async (req, res) => {
    const user = req.session.user;
    const logstatus = req.session.user ? "logout" : "login";
    try {
      const cat_data = await categorycollection.find();
      const productdata = await productCollection.find();
      const orderdata = await ordercollection.find({ userid: user });
      let userdata = await usercollection.find({ name: user })
      userdata = userdata[0];
      // console.log(orderdata);
      res.render('myorders', { userdata, logstatus, orderdata, productdata, cat_data });
    } catch (error) {
      console.log("error in my orders");
      console.log(error.message);
    }
  }
  
  const cancelorder = async (req, res) => {
    // console.log("workeddd");
    const orderid = req.body.id;
    // console.log(orderid);
    try {
      await ordercollection.updateOne({ _id: orderid }, { $set: { status: "Cancelled" } });
      const orderdata = await ordercollection.findById(orderid);
      try {
        console.log(orderdata);
        for (let i = 0; i < orderdata.itemsname.length; i++) {
          const product_name = orderdata.itemsname[i];
          const product_data = await productCollection.find({ name: product_name });
  
          const currentqty = product_data[0].quantity;
          const newQty = currentqty + orderdata.quantity[i];
          await productCollection.updateOne({ name: product_name }, { $set: { quantity: newQty } });
        }
      } catch (error) {
        console.log("Error in restocking");
        console.log(error.message);
      }
      const user = req.session.user;
      let userid = await usercollection.find({ name: user }, { _id: 1 });
      userid = userid[0]._id;
      if (orderdata.paymentMode != "COD") {
        let refundAmount = orderdata.subtotal.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const method = "Refunded";
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const currentdate = day + "/" + month + "/" + year;
        let currentamt = await walletcollection.find({ userid: userid }, { balance: 1, _id: 0 });
        currentamt = currentamt[0].balance;
        let newAmt = currentamt + refundAmount;
        await walletcollection.updateOne({ userid: userid }, { balance: newAmt }, { upsert: true });
        await walletcollection.updateOne({ userid: userid }, { $push: { amountHistory: refundAmount, date: currentdate, method: method } });
      }
      res.status(200).send('order cancelled');
    } catch (error) {
      console.log("error in cancelling order");
      console.log(error.message);
    }
  }

  const wallet = async (req, res) => {
    const user = req.session.user;
    const logstatus = user ? "logout" : "login";
    try {
      const cat_data = await categorycollection.find();
      let userdata = await usercollection.find({ name: user })
      userdata = userdata[0];
      // console.log(userdata);
      const userid = userdata._id;
      let wallethistory = await walletcollection.find({ userid: userid });
      wallethistory = wallethistory[0];
      // console.log(wallethistory);
      res.render('mywallet', { logstatus, userdata, wallethistory, cat_data });
    } catch (error) {
      console.log("error in mywallet");
      console.log(error.message);
    }
  }
  
  const addwallet = async (req, res) => {
    try {
      let amount = parseInt(req.body.amount);
      const user = req.session.user;
      let userid = await usercollection.find({ name: user }, { _id: 1 });
      userid = userid[0]._id;
      let newAmt = amount
      try {
        let currentamt = await walletcollection.find({ userid: userid }, { balance: 1, _id: 0 });
        currentamt = currentamt[0].balance;
        newAmt = currentamt + amount;
      } catch (error) {
        console.log("new user wallet");
      }
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const nowDate = day + "/" + month + "/" + year;
      const method = "Credited";
      await walletcollection.updateOne({ userid: userid }, { balance: newAmt }, { upsert: true });
      await walletcollection.updateOne({ userid: userid }, { $push: { amountHistory: amount, date: nowDate, method: method } });
      let instance = new Razorpay({ key_id: keyId, key_secret: secretkey });
      let order = await instance.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: "receipt1",
      })
      res.status(201).json({
        order,
        amount
      })
    } catch (error) {
      console.log("error in adding wallet amt");
      console.log(error.message);
    }
  }

  module.exports = {
    profile,
    profileaddress,
    addAddress,
    updatedefaultaddress,
    deleteAddress,
    usereditprofile,
    saveuserprofile,
    myorders,
    cancelorder,
    wallet,
    addwallet,
  }