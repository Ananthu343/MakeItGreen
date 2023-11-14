const usercollection = require('../../models/userdb');
const categorycollection = require('../../models/categorydb');
const { render } = require('ejs');
const productCollection = require('../../models/productdb');
const bannercollection = require('../../models/bannerdb');
const offercollection = require('../../models/offerdb');
const { json } = require('express');

const login = (req, res) => {
    
    if (req.session.user) {
      console.log("user ond");
      res.redirect('/home');
    } else {
      console.log("user illa");
      res.render("userlogin", { message: '' });
    }
  };
  
  const loginPost = async (req, res) => {
    try {
      const check = await usercollection.findOne({ name: req.body.name })
      if (check.password === req.body.password) {
        req.session.user = req.body.name;
        res.redirect('/home');
      } else {
        const message = "Incorrect password";
        res.render('userlogin', { message });
      }
    }
    catch {
      const message = "Incorrect  username";
      res.render('userlogin', { message });
      console.log("Wrong details");
    }
  }
  
  const home = async (req, res) => {
    const logstatus = req.session.user ? "logout" : "login";
    try {
      const offerdata = await offercollection.find()
      const fulldata = await productCollection.find().sort({ offer: -1 }).limit(8);
      const banner_data = await bannercollection.find();
      const cat_data = await categorycollection.find();
      res.render('userhome', { cat_data, logstatus, bannerdata: banner_data ,fulldata,offerdata});
    } catch (error) {
      console.log("error getting cat collection");
      console.log(error.message);
    }
  };
  
  const signup = (req, res) => {
    if (req.session.user) {
      res.redirect('/home');
    } else {
      res.render("usersignup", { message: '' });
    }
  };
  
  const signupPost = async (req, res) => {
    const check = await usercollection.find({ name: req.body.name });
    if (check[0]) {
      const message = "Username not accepted!";
      res.render('usersignup', { message });
    } else {
      const data = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        block_status: "unblocked"
      }
      const conpassword = req.body.conpassword;
      if (data.password === conpassword) {
        await usercollection.insertMany([data])
        req.session.user = req.body.name;
        res.render('userlogin', { message: "" });
      } else {
        const message = "password dont match!";
        res.render('usersignup', { message });
      }
    }
  }
  
  const forgotpass = (_, res) => {
    res.render('forgotpass', { message: "" });
  }

  const categoryPage = async (req, res) => {
    const logstatus = req.session.user ? "logout" : "login";
    try {
      const banner_data = await bannercollection.find();
      const offerdata = await offercollection.find();
      const category = await categorycollection.findById(req.params.id)
      const fulldata = await productCollection.find({ category: category.id });
      const cat_data = await categorycollection.find();
      res.render('categorypage', { fulldata, logstatus, offerdata, cat_data,bannerdata: banner_data });
    } catch (error) {
      console.log("error loading category page");
      console.log(error.message);
    }
  }
  
  const product_page = async (req, res) => {
    const logstatus = req.session.user ? "logout" : "login";
    const product_id = req.params.id;
    try {
      const offerdata = await offercollection.find();
      const product_details = await productCollection.find({ _id: product_id });
      const product_data = product_details[0];
      const image_data = product_data.images;
      const cat_data = await categorycollection.find();
      res.render('productpage', { product_data, image_data, logstatus, cat_data, offerdata });
    } catch (error) {
      console.log("error loading productpage");
      console.log(error.message);
    }
  }
  
  const search_product = async (req, res) => {
    const logstatus = req.session.user ? "logout" : "login";
    const product_name = req.body.productname;
    try {
      const fulldata = await productCollection.find({ name: product_name });
      const cat_data = await categorycollection.find();
      res.render('searchpage', { fulldata, logstatus ,cat_data});
    } catch (error) {
      console.log(error.message);
    }
  }

  const specialoffers = async (req,res) =>{
    const logstatus = req.session.user ? "logout" : "login";
    try {
      const cat_data = await categorycollection.find();
      const offerdata = await offercollection.find()
      const fulldata = await productCollection.find();
      res.render('specialoffers', { logstatus,fulldata,offerdata,cat_data});
    } catch (error) {
      console.log("error in special offers");
      console.log(error.message);
    }
   }

  const logout = (req, res) => {
    console.log("logged out session destroyed");
    req.session.destroy(() => {
      res.redirect("/home");
    })
  }

  module.exports = {
    login,
    loginPost,
    signup,
    signupPost,
    logout,
    home,
    forgotpass,
    categoryPage,
    product_page,
    search_product,
    specialoffers
    }