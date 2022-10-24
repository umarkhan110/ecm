const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hostel = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    cnic:{
        type:String,
        required:true
    },
    hostelname:{
        type:String,
    },
    address:{
        type:String,
        required:true
    },
    location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
    country:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    warden:{
        type:String,
    },
    room:{
        type:String,
    },
    security:{
        type:String,
    },
    role:{
        type:Number,
        default:0
    }
    
});
hostel.index({ location: "2dsphere" });
const Hostel = new mongoose.model('Hostel',hostel);
module.exports = Hostel;
