const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    image_url:{
        type: String,
        required: false
    }
});

const categoryCollection = new mongoose.model("categoryCollection",categorySchema);

module.exports = categoryCollection;