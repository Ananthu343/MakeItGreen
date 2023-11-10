
const categorycollection = require('../../models/categorydb');

const fs = require('fs');

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


module.exports = {
    category_manage,
    delete_category,
    add_category
}