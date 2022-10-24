const express = require('express')
const router = express.Router();
//const Hostel = require('../model/Hostel');
const Fypfuels = require('../model/Fypfuel.js');
const Fuelstations = require('../model/Fuel.js');
//const multer = require('multer');
//const path = require('path');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const Hostelauthenticate = require("../midleware/Hostelauthentication");
//const { check, validationResult } = require("express-validator");

// Signup Route

router.post('/signup', async (req, res) => {
    const { fname, email, password } = req.body;
    try {
        
        const userExist = await Fypfuels.findOne({ email: email });
        if (userExist) {
            return res.status(422).send({ message: "Email is already exist." });
        } else {
            const user = new Fypfuels({ fname, email, password });
            await user.save();
            return res.status(200).json({ message: "User Created Successfully" });
        }
    } catch (error) {
        console.log(error)
    }
})

//Signin Route
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        let token;
        if (!email || !password) {
            return res.status(400).json({ error: "plz fill the filled" })
        }
        const emailExist = await Fypfuels.findOne({ email: email });
        if (emailExist) {
            const passMatch = await bcrypt.compare(password, emailExist.password);
            token = await emailExist.generateAuthToken();
            //console.log( "ya token ha abahi " + token)
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 9000000),
                httpOnly: true
            });
            if (!passMatch) {
                res.status(400).json({ error: "Password is not correct" })
            }else {
                res.json({ message: "Login Successfully" });
            }
        } else {
            res.status(400).json({ error: "Wrong Email" });
        }
    } catch (error) {
        console.log(error)
    }
})


router.post('/addfuelstation', async (req, res) => {
    const { fuelstationname,companyname,cnic,mobile,address,lat,lng,country,city} = req.body;    
    
    try {
        const item = new Fuelstations({fuelstationname,companyname,mobile, cnic,address,location:{type:"Point", coordinates:[lat,lng]},country,city });
        const saveitem = await item.save();
        return res.status(200).json({ message: "Product Added 2345" });
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;