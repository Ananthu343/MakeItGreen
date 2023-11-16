const bannercollection = require('../../models/bannerdb');

const fs = require('fs');

const banner_manage = async (req, res) => {
    try {
        const bannerdata = await bannercollection.find();
        res.render('bannermanagement', { fulldata: bannerdata });
    } catch (error) {
        console.log("error in banner manage");
        console.log(error.message);
    }
}

const add_banner = async (req, res) => {
    try {
        let imagePath = req.files[0].path;
        // Check if the path includes "public/" (Windows uses backslashes)
        if (imagePath.includes('public\\')) {
            // Remove the "public/" prefix for Windows
            imagePath = imagePath.replace('public\\', '');
        } else if (imagePath.includes('public/')) {
            // Remove the "public/" prefix for Unix-like systems
            imagePath = imagePath.replace('public/', '');
        }
        const banner_data = {
            name: req.body.bannername,
            description: req.body.description,
            image_url: imagePath
        }
        try {
            await bannercollection.insertMany([banner_data]);
            res.redirect('/admin/bannermanagement');
        } catch (error) {
            console.log(error.message);
            console.log("error adding banner");
        }
    } catch (error) {
        console.log("error in banner");
        console.log(error.message);
    }
}

const edit_banner = async(req,res)=>{
    const banner_id = req.params.id;
    let data = await bannercollection.findById(banner_id);
    res.render('banner_edit',{data});
}

const update_banner = async (req,res)=>{
    const banner_id = req.params.id;
    let imagePath ;
    if(req.files[0]){
         imagePath = req.files[0].path;
        // Check if the path includes "public/" (Windows uses backslashes)
        if (imagePath.includes('public\\')) {
            // Remove the "public/" prefix for Windows
            imagePath = imagePath.replace('public\\', '');
        } else if (imagePath.includes('public/')) {
            // Remove the "public/" prefix for Unix-like systems
            imagePath = imagePath.replace('public/', '');
        }
    }else{
        const bannerdata = await bannercollection.findById(banner_id);
        imagePath = bannerdata.image_url;
    }
    
    const banner_data = {
        name: req.body.bannername,        
        description: req.body.description,
        image_url: imagePath
    }
    try {
        await bannercollection.updateOne({_id:banner_id},{$set:banner_data});
        res.redirect('/admin/bannermanagement');
    } catch (error) {
        console.log("error in updating banner");
        console.log(error.message);
    }
}

const delete_bannerimg = async (req,res)=>{
    console.log(req.params);
    const banner_id = req.params.id;
    const index = req.params.index;
    try {
        const bannerdata = await bannercollection.findById(banner_id);
        let images = bannerdata.image_url;
        images.splice(index, 1);
        await bannercollection.updateOne({ _id: banner_id }, { $set:{ image_url: images }});
        res.redirect(`/editbanner/${banner_id}`);
    } catch (error) {
        console.log(error.message);
        console.log("error updating img");
    }
}


const delete_banner = async (req, res) => {
    const banner_id = req.params.id;
    try {
        const banner = await bannercollection.findById(banner_id)
        let imagePath = banner.image_url[0];
        if (imagePath.includes('uploads\\')) {
            imagePath = imagePath.replace('uploads\\', 'public/uploads\\');
        }
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.log(err.message);
                console.log("No image found");
            }
        })
        await bannercollection.findByIdAndDelete(banner_id);
        res.redirect('/admin/bannermanagement');
    } catch (error) {
        console.log("error deleting banner");
    }
}

module.exports = {
    banner_manage,
    add_banner,
    edit_banner,
    update_banner,
    delete_bannerimg,
    delete_banner
}