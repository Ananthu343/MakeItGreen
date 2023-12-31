
const ordercollection = require('../../models/orderdb');

const order_manage = async (req, res) => {
    try {
        const orderdata = await ordercollection.find();
        res.render('ordermanagement', { orderdata });
    } catch (error) {
        console.log("error in ordermanagement");
        console.log(error.message);
    }
}

const confirmorder = async (req, res) => {
    const orderid = req.body.id;
    try {
        await ordercollection.updateOne({ _id: orderid }, { $set: { status: "Confirmed" } });
        res.status(200).send('order confirmed');
    } catch (error) {
        console.log("error in confirming order");
        console.log(error.message);
    }
}

const deliveredorder = async (req, res) => {
    const orderid = req.body.id;
    try {
        await ordercollection.updateOne({ _id: orderid }, { $set: { status: "Delivered" } });
        res.status(200).send('order Delivered');
    } catch (error) {
        console.log("error in delivering order");
        console.log(error.message);
    }
}

const pendingorder = async (req, res) => {
    const orderid = req.body.id;
    try {
        await ordercollection.updateOne({ _id: orderid }, { $set: { status: "Pending" } });
        res.status(200).send('order pending');
    } catch (error) {
        console.log("error in pending order");
        console.log(error.message);
    }
}

module.exports = {
    order_manage,
    confirmorder,
    deliveredorder,
    pendingorder
}