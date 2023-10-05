const usercollection = require('../models/userdb');
const categorycollection = require('../models/categorydb');

const adlogin=(req,res)=>{
    if(req.session.admin){
        console.log("admin ond bro");
        res.redirect('/admin/dashboard')
    }else{
        console.log("no admin");
      res.render('adminlogin',{message:""})
    }
      
    
    }


const adloginpost = (req,res)=>{
    // console.log(req.body.name);
    const name = 'admin'
    const password = 1234

    if(name === req.body.name && password ==req.body.password){
 
        //adding session 
        req.session.admin = name;

        res.redirect('/admin/dashboard');
    }else {
        // console.log('here');
        res.render('adminlogin',{message:'invalid username or password :('})
    }
}

const dashboard = async (req, res) => {
    res.render('dashboard');

};

const user_manage = async (req, res) => {
    try {
        const data = await usercollection.find();
        res.render('usermanagement',{fulldata:data , user_data:"",message:"empty"});
    } catch (error) {
        console.log("error fetching user data");
    }

};

const block = async (req,res) =>{
    const user_id = req.params.id;
    // console.log(user_id);
    try {
        await usercollection.updateOne({_id:user_id},{$set:{block_status:"blocked"}});
        res.redirect('/admin/usermanagement');
    } catch (error) {
        console.log("Error to block");
    }
}
const unblock = async (req,res) =>{
    const user_id = req.params.id;
    // console.log(user_id);
    try {
        await usercollection.updateOne({_id:user_id},{$set:{block_status:"unblocked"}});
        // const data = await usercollection.find();
        // res.render('usermanagement',{fulldata:data});
        res.redirect('/admin/usermanagement');
    } catch (error) {
        console.log("Error to unblock");
    }
}

const search_user = async (req,res)=>{
    const username = req.body.searchid;
    console.log(username);
    try {
        const search_data = await usercollection.find({name:username});
        const data = await usercollection.find();
        if(search_data){
            res.render('usermanagement',{user_data:search_data,fulldata:data})
        }else{
            res.render('usermanagement',{fulldata:data,user_data:"",message:"User not found"})

        }
    } catch (error) {
     console.log("error fetching searchdata");   
    }
}

const category_manage = async (req,res)=>{
    try {
        const category_data = await categorycollection.find();
        res.render('categorymanagement',{fulldata:category_data});
    } catch (error) {
        console.log("error fetching categorydata");
    }
}

const delete_category = async (req,res)=>{
     const cate_id = req.params.id;
     try {
        await categorycollection.findByIdAndDelete(cate_id);
        res.redirect('/admin/categorymanagement');
     } catch (error) {
        console.log("error deleting");
     }
}

const add_category = async (req,res)=>{
    console.log(req.body);
    const cate_data = {
        name: req.body.categoryname,
        image_url: req.body.imgfile
    }
    console.log(cate_data);
    try {
        await categorycollection.insertMany([cate_data]);
        res.redirect('/admin/categorymanagement');
    } catch (error) {
        console.log(error.message);
        console.log("error adding category");
    }
}


const adlogout = (req,res)=>{
    console.log("logged out session destroyed"); 
    req.session.destroy(()=>{
        res.redirect("/adminlogin");
    })
}


module.exports ={
    adloginpost,
    adlogin,
    adloginpost,
    adlogout,
    dashboard,
    user_manage,
    block,
    unblock,
    search_user,
    category_manage,
    delete_category,
    add_category
}