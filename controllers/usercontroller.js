const usercollection = require('../models/userdb');
const categorycollection = require('../models/categorydb');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const { render } = require('ejs');
const productCollection = require('../models/productdb');
const cartcollection = require('../models/cartdb');

const myemail = process.env.MY_EMAIL;
const mypass = process.env.MY_PASS;




const login =(req,res)=>{
    console.log(req.session.user);
    if(req.session.user){
        console.log("user ond");
        res.redirect('/home');

    }else{
        console.log("user illa");
        res.render("userlogin",{message:''});
    }
};

const loginPost = async (req,res)=>{
    console.log(req.body);
    try{
        const check = await usercollection.findOne({name:req.body.name})
        if(check.password===req.body.password){
            req.session.user = req.body.name;
            // console.log(req.session.user);
            res.redirect('/home');
        }else{
            const message = "Incorrect password";
            res.render('userlogin',{message});
        }
    }
    catch{
        const message = "Incorrect  username";
        res.render('userlogin',{message}); 
      console.log("Wrong details");
    }

    
}

const home = async (req, res) => {
    const logstatus = req.session.user? "logout" :  "login";
    console.log("home get worked");
    // console.log(req.session.user);
    try {
       const cat_data = await categorycollection.find();
       res.render('userhome',{cat_data,logstatus});
    } catch (error) {
      console.log("error getting cat collection");
    }
    
};

const signup = (req,res)=>{
    if(req.session.user){
        res.redirect('/home');

    }else{
        res.render("usersignup",{message:''});
    }
    
};

const signupPost = async (req,res)=>{
// console.log(req.body);
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
         res.render('userlogin',{message:""});
    } else {
        const message = "password dont match!";
        res.render('usersignup',{message}); 
    }
    
}

const forgotpass = (_,res)=>{
    res.render('forgotpass',{message:""});
} 

const forgotpasspost = async (req,res)=>{
    try {
        const check = await usercollection.findOne({email:req.body.email});
        if (check) {
           
            const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
            await usercollection.updateOne({email : req.body.email},{otp : otp ,otpExpires: 1 });
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
                const data = await usercollection.findOne({email:req.body.email})
                console.log(data);
                console.log("hehehe");
                const expirationTime = data.otpExpires;
              res.render('otpPage',{message:"" , email: req.body.email,expirationTime,currentsec:59});
              
              } catch (error) {
                console.log("error in searching expiretime");
              }

        } else {
            res.render('forgotpass',{message:"no user with this id!!"})
        }
    } catch (error) {
        console.log(error);
    }
}

const resend =async (req,res) =>{
   
    console.log(req.params);
    const useremail = req.params.email

    try {
        // const date = new Date();
        // const expiretime = new Date().getTime() + 3 * 60 * 1000;
        // console.log(expiretime);
        
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        await usercollection.updateOne({email : useremail},{otp : otp ,otpExpires: 1 });
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
            const data = await usercollection.findOne({email:req.params.email})
            console.log(data);
            const expirationTime = data.otpExpires;
            console.log(expirationTime);
            res.render('otpPage',{message:"" , email: req.params.email,expirationTime,currentsec:59});
          
          } catch (error) {
            console.log("error in searching expiretime");
          } 
    } catch (error) {
        console.log(error.message);
    }

}

const otpexpired = async(req,res) =>{
      console.log(req.params);
      try {
        await usercollection.updateOne({email : req.params.email},{$unset:{otp:"",otpExpires:""}});
        console.log("otp expired");
        res.render('otpPage',{message:"" , email: req.params.email,expirationTime:-1,currentsec:-1});
        

const data = await usercollection.findOne({email:req.params.email})
            console.log(data);
            const expirationTime = data.otpExpires;
            console.log(expirationTime);

          } catch (error) {
        
      }
}

const confirmotp = async(req,res)=>{
      try {
        // console.log(req.query);
        console.log(req.body);
        console.log(req.params);
        const data = await usercollection.findOne({email:req.params.email})
            // console.log(data);
            const db_otp = data.otp;
            const user_otp = req.body.otp
            console.log("confirm aayi");
            console.log(db_otp);
            console.log(user_otp);
            if (db_otp == user_otp) {
              try {
                await usercollection.updateOne({email : req.params.email},{$unset:{otp:"",otpExpires:""}});
                res.render('changepass',{message:"",email: req.params.email});
              } catch (error) {
                console.log(error.message);
              }
               
            } else {
               
                res.render('otpPage',{message:"Invalid otp" , email: req.params.email,expirationTime:req.body.min,currentsec:req.body.sec});
                console.log(data);
                
            }
      } catch (error) {
        console.log(error.message);
      }
    
}

const changepass = async (req,res)=>{
  // console.log(req.params);
     console.log("change pass");
     const pass = req.body.password;
     const conpass = req.body.conpassword;
     if (pass === conpass) {
      try {
        await usercollection.updateOne({email:req.params.email},{$set:{password:pass}});
        res.render('userlogin',{message:"password changed successfully"});
      } catch (error) {
        console.log(error.message);
      }
      
     } else {
      res.render('changepass',{message:"password didn't match",email: req.params.email});
     }
}


const categoryPage =async (req,res)=>{
  const logstatus = req.session.user? "logout" :  "login";
  console.log(req.params.id)
  try {
    const category = await categorycollection.findById(req.params.id)
    const fulldata = await productCollection.find({category:category.name});
    console.log(fulldata);
    res.render('categorypage',{fulldata,logstatus});
    console.log(category);
  } catch (error) {
    console.log(error.message);
  }
 
  
}

const product_page = async (req,res)=>{
  const logstatus = req.session.user? "logout" :  "login";
  const product_id = req.params.id;
  try {
    const product_details = await productCollection.find({_id:product_id});
    const product_data = product_details[0];
    console.log(product_data);
    const image_data = product_data.images;
    console.log(image_data);
    res.render('productpage',{product_data,image_data,logstatus});
  } catch (error) {
    console.log("error loading productpage");
    console.log(error.message);
  }
}

const search_product = async (req,res)=>{
  const logstatus = req.session.user? "logout" :  "login";
  console.log("hehe");
  const product_name = req.body.productname;
  try {
    const fulldata = await productCollection.find({name:product_name});
    console.log(fulldata);
    res.render('searchpage',{fulldata,logstatus});

   
  
  } catch (error) {
    console.log(error.message);
  }
}

const cart = async(req,res)=>{
  try {
    const logstatus = req.session.user? "logout" :  "login";
    const cartdata = await cartcollection.find({userid:req.session.user});
    // console.log(cartdata);
    if(cartdata[0]){
      let sum_subtotal = await cartcollection.aggregate([{$match:{userid:req.session.user}},{$group:{_id:null,sum:{$sum:"$subtotal"}}}]);
      sum_subtotal = sum_subtotal[0].sum;
      const shippingFee = 40;
      const totalAmount = sum_subtotal + shippingFee;
      console.log(sum_subtotal);
      res.render('cart',{logstatus,cartdata,sum_subtotal,shippingFee,totalAmount});
    }else{
      sum_subtotal = "empty cart";
      const shippingFee = "empty cart";
      const totalAmount = "empty cart";
      // console.log(sum_subtotal);
      res.render('cart',{logstatus,cartdata,sum_subtotal,shippingFee,totalAmount});
    }
    
  } catch (error) {
    console.log(error.message);
    // console.log("preshnam");
  }
}

const addcart = async (req,res)=>{
  const product_id = req.params.id;
  try {
    const product_data = await productCollection.findById(product_id);
    const cartitem = {
      userid : req.session.user,
      productid : product_id,
      productname : product_data.name,
      image_url : product_data.images[0],
      quantity : 1,
      price : product_data.price,
      subtotal : product_data.price
    }
    await cartcollection.insertMany([cartitem]);
    res.redirect('back');
  } catch (error) {
    console.log(error.message);
    console.log("error adding product to cart");
  }
}

const removeproduct = async (req,res)=>{
  const cartid = req.params.id;
  try {

    const cart = await cartcollection.findById(cartid)
    await cartcollection.findByIdAndDelete(cartid);
    res.redirect('back');
} catch (error) {
    console.log("error deleting");
}
}

 const addQty = async (req,res)=>{
     const cartid = req.body.id;
     try {
      const cartdata = await cartcollection.findById(cartid);
      const fixedPrice = cartdata.price;
      let currentqty = cartdata.quantity;
      // console.log(cartid);
      currentqty++;
      console.log(currentqty);
      const Subtotal = cartdata.subtotal;
      const newSubtotal = Subtotal + fixedPrice;
      console.log(Subtotal);
      await cartcollection.updateOne({_id:cartid},{$set:{quantity:currentqty,subtotal:newSubtotal}})
      return res.status(200).send()
     } catch (error) {
      console.log(error.message);
      console.log("not adding qty");
     }
 }
 const subQty = async (req,res)=>{
  const cartid = req.body.id;
  try {
   const cartdata = await cartcollection.findById(cartid);
   const fixedPrice = cartdata.price;
   let currentqty = cartdata.quantity;
   console.log(currentqty);
   // console.log(cartid);
   if (currentqty == 1) {
    await cartcollection.findByIdAndDelete(cartid);
   }else{
   currentqty--;
   const Subtotal = cartdata.subtotal;
   const newSubtotal = Subtotal - fixedPrice;
   console.log(currentqty);
   await cartcollection.updateOne({_id:cartid},{$set:{quantity:currentqty,subtotal:newSubtotal}})
   } 
   return res.status(200).send()
  
  } catch (error) {
   console.log(error.message);
   console.log("not subbing qty");
  }
}

const clearCart = async(req,res)=>{
  console.log("worked");
   try {
    await cartcollection.deleteMany({userid:req.session.user});
    res.redirect('back');
   } catch (error) {
    console.log(error.message);
   }
}

const profile = (req,res)=>{
  const username = req.session.user;
  const logstatus = req.session.user? "logout" :  "login";
  console.log(username);
  res.render('userprofile',{logstatus});
}

const logout = (req,res)=>{
    console.log("logged out session destroyed"); 
    req.session.destroy(()=>{
        res.redirect("/home");
    })
}

module.exports={
    login,
    loginPost,
    signup,
    signupPost,
    logout,
    home,
    forgotpass,
    forgotpasspost,
    resend,
    otpexpired,
    confirmotp,
    changepass,
    categoryPage,
    product_page,
    search_product,
    cart,
    addcart,
    removeproduct,
    addQty,
    subQty,
    clearCart,
    profile
}