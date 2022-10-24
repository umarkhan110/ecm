const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const fypclient = new mongoose.Schema({
    customerfname:{
        type:String,
        required:true
    },
    customerlname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
});

fypclient.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

fypclient.methods.generateAuthToken = async function (){
    try{
        let token =jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch  (err){
        console.log(err);
    }
}

const Fypclients = new mongoose.model('Fypclients',fypclient);
module.exports = Fypclients;
