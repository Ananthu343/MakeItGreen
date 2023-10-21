const usercollection = require('../models/userdb');
const categorycollection = require('../models/categorydb');
const productcollection = require('../models/productdb');
const path = require('path')

const fs = require('fs');
const ordercollection = require('../models/orderdb');

const adlogin = (req, res) => {
    if (req.session.admin) {
        console.log("admin ond bro");
        res.redirect('/admin/dashboard')
    } else {
        console.log("no admin");
        res.render('adminlogin', { message: "" })
    }


}


const adloginpost = (req, res) => {
    // console.log(req.body.name);
    const name = 'admin'
    const password = 1234

    if (name === req.body.name && password == req.body.password) {

        //adding session 
        req.session.admin = name;

        res.redirect('/admin/dashboard');
    } else {
        // console.log('here');
        res.render('adminlogin', { message: 'invalid username or password :(' })
    }
}

const dashboard = async (req, res) => {
    res.render('dashboard');

};

const user_manage = async (req, res) => {
    try {
        const data = await usercollection.find();
        res.render('usermanagement', { fulldata: data, user_data: "" });
    } catch (error) {
        console.log("error fetching user data");
    }

};

const block = async (req, res) => {
    const user_id = req.params.id;
    // console.log(user_id);
    try {
        await usercollection.updateOne({ _id: user_id }, { $set: { block_status: "blocked" } });
        res.redirect('/admin/usermanagement');
    } catch (error) {
        console.log("Error to block");
    }
}
const unblock = async (req, res) => {
    const user_id = req.params.id;
    // console.log(user_id);
    try {
        await usercollection.updateOne({ _id: user_id }, { $set: { block_status: "unblocked" } });
        // const data = await usercollection.find();
        // res.render('usermanagement',{fulldata:data});
        res.redirect('/admin/usermanagement');
    } catch (error) {
        console.log("Error to unblock");
    }
}

const search_user = async (req, res) => {
    const username = req.body.searchid;
    console.log(username);
    try {
        const search_data = await usercollection.find({ name: username });

        const data = await usercollection.find();


        if (search_data) {
            res.render('usermanagement', { user_data: search_data, fulldata: data })
        } else {
            console.log("worked");
            res.render('usermanagement', { fulldata: data, user_data: "", })

        }
    } catch (error) {
        console.log("error fetching searchdata");
    }
}

const category_manage = async (req, res) => {
    try {
        const category_data = await categorycollection.find();
        res.render('categorymanagement', { fulldata: category_data, message: "" });
    } catch (error) {
        console.log("error fetching categorydata");
    }
}

const delete_category = async (req, res) => {
    const cate_id = req.params.id;
    try {

        const category = await categorycollection.findById(cate_id)
        console.log(category.image_url[0]);
        let imagePath = category.image_url[0];
        if (imagePath.includes('uploads\\')) {

            imagePath = imagePath.replace('uploads\\', 'public/uploads\\');
            console.log(imagePath);
        }

        fs.unlink(imagePath, (err) => {
            if (err) {
                console.log("No image found");
            }
        })

        await categorycollection.findByIdAndDelete(cate_id);
        res.redirect('/admin/categorymanagement');
    } catch (error) {
        console.log("error deleting");
    }
}

const add_category = async (req, res) => {
    console.log(req.body);
    console.log(req.files);


    const cate_names = await categorycollection.find({}, { name: 1, _id: 0 });
    // console.log(cate_names);
    const upper_names = cate_names.map((item) => {
        let name = item.name;
        return name.toUpperCase();
    });

    let body_name = req.body.categoryname;
    body_name = body_name.toUpperCase();
    let flag = 0;
    upper_names.forEach((item) => {
        if (item === body_name) {
            flag = 1;
        }
    })

    console.log(body_name);
    console.log(upper_names);
    if (flag == 1) {
        const category_data = await categorycollection.find();
        res.render('categorymanagement', { fulldata: category_data, message: "Category already exists" });
        // res.redirect('/admin/categorymanagement');
    } else {
        console.log("worked");
        let imagePath = req.files[0].path;
        console.log(imagePath);
        // Check if the path includes "public/" (Windows uses backslashes)
        if (imagePath.includes('public\\')) {
            // Remove the "public/" prefix for Windows
            imagePath = imagePath.replace('public\\', '');
        } else if (imagePath.includes('public/')) {
            // Remove the "public/" prefix for Unix-like systems
            imagePath = imagePath.replace('public/', '');
        }

        // console.log(image);
        const cate_data = {
            name: req.body.categoryname,
            image_url: imagePath
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


}

const product_manage = async (req, res) => {
    try {
        const fulldata = await productcollection.find();
        const cate_names = await categorycollection.distinct('name');
        console.log(cate_names);
        // res.render('productmanagement');
        res.render('productmanagement', { fulldata, product_data: "", cate_names });
    } catch (error) {
        console.log("error loading product data");
    }
}

const add_product = async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    let imagePath = [];
    const imgarray = req.files
    imgarray.forEach(element => {
        if (element.path) {
            imagePath.push(element.path)
        } else {
            imagePath.push("");
        }
    });

    console.log(imagePath);

    const newimagepath = imagePath.map((path) => {
        if (path.includes('public\\')) {
            return path.substring(6);
        } else if (path.includes('public/')) {
            return path.substring(6);
        }
    })

    console.log(newimagepath);
    const product_data = {
        name: req.body.product,
        price: req.body.price,
        quantity: req.body.quantity,
        offer: req.body.offer,
        description: req.body.description,
        category: req.body.category,
        images: newimagepath
    }
    console.log(product_data);
    try {
        await productcollection.insertMany([product_data]);
        res.redirect('/admin/productmanagement');
    } catch (error) {
        console.log(error.message);
        console.log("error adding product");
    }
}

const search_product = async (req, res) => {
    const productname = req.body.searchid;
    console.log(productname);
    try {
        const search_data = await productcollection.find({ name: productname });
        const data = await productcollection.find();
        const cate_names = await categorycollection.distinct('name');
        if (search_data) {
            res.render('productmanagement', { product_data: search_data, fulldata: data, cate_names })
        } else {
            res.render('productmanagement', { fulldata: data, product_data: "", cate_names })

        }
    } catch (error) {
        console.log("error fetching searchdata");
    }
}

const delete_product = async (req, res) => {
    const product_id = req.params.id;
    try {
        await productcollection.updateOne({ _id: product_id }, { $set: { quantity: 0 } });
        res.redirect('/admin/productmanagement');
    } catch (error) {
        console.log("error deleting product");
    }
}

const edit_product = async (req, res) => {
    const product_id = req.params.id;
    let data = await productcollection.find({ _id: product_id });
    data = data[0];
    const cate_names = await categorycollection.distinct('name');
    //  console.log(data);
    res.render('product_edit', { data, cate_names });
}

const delete_image = async (req, res) => {
    console.log(req.params);
    const productid = req.params.id;
    const index = req.params.index;
    try {
        const productdata = await productcollection.findById(productid);
        let images = productdata.images;
        images.splice(index, 1);
        await productcollection.updateOne({ _id: productid }, { $set: { images: images } });
        res.redirect(`/editproduct/${productid}`);
    } catch (error) {
        console.log("error updating img");
    }
}

const update_product = async (req,res)=>{
       const product_id = req.params.id;
       console.log(req.body);
       let imagePath = [];
       const imgarray = req.files
       imgarray.forEach(element => {
           if (element.path) {
               imagePath.push(element.path)
           } else {
               imagePath.push("");
           }
       });
       const newimagepath = imagePath.map((path) => {
        if (path.includes('public\\')) {
            return path.substring(6);
        } else if (path.includes('public/')) {
            return path.substring(6);
        }
        })

    console.log(newimagepath);
    const product_data = {
        name: req.body.product,
        price: req.body.price,
        quantity: req.body.quantity,
        offer: req.body.offer,
        description: req.body.description,
        category: req.body.category,
        images: newimagepath
    }
    try {
        await productcollection.updateOne({_id:product_id},{$set:product_data},{upsert:true})
        res.redirect('/admin/productmanagement');
    } catch (error) {
        
    }
}

const order_manage = async(req,res)=>{
    try {
        console.log("working aanu");
        const orderdata = await ordercollection.find();
        console.log(orderdata);
        res.render('ordermanagement',{orderdata});
    } catch (error) {
        console.log("error in ordermanagement");
        console.log(error.message);
    }
}


const adlogout = (req, res) => {
    console.log("logged out session destroyed");
    req.session.destroy(() => {
        res.redirect("/adminlogin");
    })
}


module.exports = {
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
    add_category,
    product_manage,
    add_product,
    search_product,
    delete_product,
    edit_product,
    delete_image,
    update_product,
    order_manage
}