const categorycollection = require('../../models/categorydb');
const productcollection = require('../../models/productdb');
const offercollection = require('../../models/offerdb');

const product_manage = async (req, res) => {
    try {
        const fulldata = await productcollection.find();
        const catedata = await categorycollection.find();
        res.render('productmanagement', { fulldata, product_data: "", catedata });
    } catch (error) {
        console.log("error loading product data");
    }
}

const add_product = async (req, res) => {
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
    const product_data = {
        name: req.body.product,
        price: req.body.price,
        quantity: req.body.quantity,
        offer: req.body.offer,
        description: req.body.description,
        category: req.body.categoryid,
        images: newimagepath
    }
    try {
        await productcollection.insertMany([product_data]);
        try {
            let productid = await productcollection.find({ name: product_data.name });
            productid = productid[0]._id;
            const offerpercent = req.body.offer;
            const originalPrice = req.body.price;
            const discountAmount = (originalPrice * offerpercent) / 100;
            const offerPrice = parseInt(originalPrice - discountAmount);
            await offercollection.insertMany([{ productid: productid, offerPercent: offerpercent, offerPrice: offerPrice }]);
        } catch (error) {
            console.log(error.message);
            console.log("error in inserting offer");
        }
        res.redirect('/admin/productmanagement');
    } catch (error) {
        console.log(error.message);
        console.log("error adding product");
    }
}

const search_product = async (req, res) => {
    const productname = req.body.searchid;
    try {
        const search_data = await productcollection.find({ name: productname });
        const data = await productcollection.find();
        const cate_names = await categorycollection.distinct('name');
        if (search_data) {
            res.render('productmanagement', { product_data: search_data, fulldata: data, cate_names });
        } else {
            res.render('productmanagement', { fulldata: data, product_data: "", cate_names });
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
    const catedata = await categorycollection.find();
    res.render('product_edit', { data, catedata });
}

const delete_image = async (req, res) => {
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

const update_product = async (req, res) => {
    const product_id = req.params.id;
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
    const product_data = {
        name: req.body.product,
        price: req.body.price,
        quantity: req.body.quantity,
        offer: req.body.offer,
        description: req.body.description,
        category: req.body.categoryid,
    }
    const offerpercent = req.body.offer;
    const originalPrice = req.body.price;
    const discountAmount = (originalPrice * offerpercent) / 100;
    const offerPrice = parseInt(originalPrice - discountAmount);
    try {
        await offercollection.updateOne({ productid: product_id }, { $set: { offerPercent: offerpercent, offerPrice: offerPrice } }, { upsert: true });
        await productcollection.updateOne({ _id: product_id }, { $set: product_data }, { upsert: true })
        await productcollection.updateOne({ _id: product_id }, { $push: {images : newimagepath} })
        res.redirect('/admin/productmanagement');
    } catch (error) {
        console.log("error in updating offer");
        console.log(error.message);
    }
}

module.exports = {
    product_manage,
    add_product,
    search_product,
    delete_product,
    edit_product,
    delete_image,
    update_product,
}