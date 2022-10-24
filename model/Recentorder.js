const mongoose = require('mongoose');

const rcorder = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Fypfuel'
    },
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Fypclient'
    },
    customerfname:{
        type:String,
        required:true
    },
    customerlname:{
        type:String,
        required:true
    },
    service:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:0
    }
});


const Recentorder = new mongoose.model('Recentorder', rcorder);
module.exports = Recentorder;
