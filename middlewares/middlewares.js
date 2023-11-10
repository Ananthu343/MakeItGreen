const usercollection = require('../models/userdb');
const cartcollection = require('../models/cartdb');


const isitblocked = async (req,res,next)=> {
    try {
        // console.log(req.body);
        const data = await usercollection.findOne({name:req.body.name});
        if (data.block_status == "blocked") {
            console.log("blocked aanu");
            res.render('userlogin',{message:"Account blocked by admin!"});
        }else {
            next();
        }
        
    } catch (error) {
        console.log("error checking blocked");
        // next()
    }
}

const cartempty =  async(req,res,next)=> {
    try {
        const data = await cartcollection.findOne({userid : req.session.user});
        if (data) {
            next();
        }else {
            res.redirect('/cart');
        }
        
    } catch (error) {
        console.log("error checking cartempty");
        res.redirect('/cart');
    }
}


const authenticate = (req, res, next)=> {
    console.log("authenticating");
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

module.exports ={
    isitblocked,
    cartempty,
    authenticate
}