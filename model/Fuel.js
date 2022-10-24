const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const fuelstation = new mongoose.Schema({
    fuelstationname:{
        type:String,
        required:true
    },
    companyname:{
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
    }
    
});
fuelstation.index({ location: "2dsphere" });
const Fuelstations = new mongoose.model('Fuelstations',fuelstation);
module.exports = Fuelstations;
