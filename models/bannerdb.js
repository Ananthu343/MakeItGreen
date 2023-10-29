const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image_url:[{
        type: String,
        required: false
    }]
});

const bannerCollection = new mongoose.model("bannerCollection",bannerSchema);

module.exports = bannerCollection;