const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hosteluser = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:0
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
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

hosteluser.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

hosteluser.methods.generateAuthToken = async function (){
    try{
        let token =jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch  (err){
        console.log(err);
    }
}

const Hostelusers = new mongoose.model('Hostelusers',hosteluser);
module.exports = Hostelusers;
