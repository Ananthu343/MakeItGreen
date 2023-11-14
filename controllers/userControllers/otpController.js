const usercollection = require('../../models/userdb');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const { render } = require('ejs');
const { json } = require('express');

const myemail = process.env.MY_EMAIL;
const mypass = process.env.MY_PASS;

const forgotpasspost = async (req, res) => {
    try {
      const check = await usercollection.findOne({ email: req.body.email });

      if (check) {
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        await usercollection.updateOne({ email: req.body.email }, { otp: otp, otpExpires: 1 });
        const transporter = nodemailer.createTransport({
          service: 'Gmail', // Replace with your email service provider (e.g., 'Gmail', 'Outlook')
          auth: {
            user: myemail, // Your email address
            pass: mypass, // Your email password (or an app-specific password for Gmail)
          }
        });
  
        const mailOptions = {
          from: myemail, // Your email address
          to: req.body.email, // Receiver's email address
          subject: 'Your OTP Code',
          text: `Your OTP code is: ${otp}`,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            console.log(error.message);
          } else {
            console.log('Email sent:', info.response);
          }
        });
        try {
          const data = await usercollection.findOne({ email: req.body.email })
          console.log(data);
          const expirationTime = data.otpExpires;
          res.render('otpPage', { message: "", email: req.body.email, expirationTime, currentsec: 59 });
  
        } catch (error) {
          console.log("error in searching expiretime");
        }
      } else {
        res.render('forgotpass', { message: "no user with this id!!" })
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const resend = async (req, res) => {
    const useremail = req.params.email
  
    try {
      const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
      await usercollection.updateOne({ email: useremail }, { otp: otp, otpExpires: 1 });
      const transporter = nodemailer.createTransport({
        service: 'Gmail', // Replace with your email service provider (e.g., 'Gmail', 'Outlook')
        auth: {
          user: myemail, // Your email address
          pass: mypass, // Your email password (or an app-specific password for Gmail)
        }
      });
  
      const mailOptions = {
        from: myemail, // Your email address
        to: useremail, // Receiver's email address
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          console.log(error.message);
        } else {
          console.log('Email sent:', info.response);
        }
      });
  
      try {
        const data = await usercollection.findOne({ email: req.params.email })
        console.log(data);
        const expirationTime = data.otpExpires;
        console.log(expirationTime);
        res.render('otpPage', { message: "", email: req.params.email, expirationTime, currentsec: 59 });
  
      } catch (error) {
        console.log("error in searching expiretime");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  
  const otpexpired = async (req, res) => {
    console.log(req.params);
    try {
      await usercollection.updateOne({ email: req.params.email }, { $unset: { otp: "", otpExpires: "" } });
      res.render('otpPage', { message: "", email: req.params.email, expirationTime: -1, currentsec: -1 });
      const data = await usercollection.findOne({ email: req.params.email })
      const expirationTime = data.otpExpires;
      console.log(expirationTime);
    } catch (error) {
      console.log(error.message);
    }
  }
  
  const confirmotp = async (req, res) => {
    try {
      const data = await usercollection.findOne({ email: req.params.email })
      const db_otp = data.otp;
      const user_otp = req.body.otp
  
      if (db_otp == user_otp) {
        try {
          await usercollection.updateOne({ email: req.params.email }, { $unset: { otp: "", otpExpires: "" } });
          res.render('changepass', { message: "", email: req.params.email });
        } catch (error) {
          console.log(error.message);
        }
      } else {
        res.render('otpPage', { message: "Invalid otp", email: req.params.email, expirationTime: req.body.min, currentsec: req.body.sec });
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  
  const changepass = async (req, res) => {
    const pass = req.body.password;
    const conpass = req.body.conpassword;
    
    if (pass === conpass) {
      try {
        await usercollection.updateOne({ email: req.params.email }, { $set: { password: pass } });
        res.render('userlogin', { message: "password changed successfully" });
      } catch (error) {
        console.log(error.message);
      }
    } else {
      res.render('changepass', { message: "password didn't match", email: req.params.email });
    }
  }

  module.exports = {
    forgotpasspost,
    resend,
    otpexpired,
    confirmotp,
    changepass,
  }