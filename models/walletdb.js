const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usercollection'
    },
    balance:{
        type: Number,
        required: true
    },
    amountHistory:[{
        type: Number,
        required: true
    }],
    method:[{
        type: String,
        ref: 'ordercollection'
    }],
    date:[{
        type: String,
        required : true
    }]
});

const walletCollection = new mongoose.model("walletCollection",walletSchema);

module.exports = walletCollection;