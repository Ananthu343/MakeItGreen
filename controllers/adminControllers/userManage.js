const usercollection = require('../../models/userdb');

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

module.exports = {
    user_manage,
    block,
    unblock,
    search_user
}