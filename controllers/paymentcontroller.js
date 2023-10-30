const Razorpay = require('razorpay');

const keyId =  process.env.RAZORPAY_ID_KEY;
const secretkey = process.env.RAZORPAY_SECRET_KEY;

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: secretkey,
});

module.exports = {
    razorpay
}