const express = require('express')
const router = express.Router();
//const Hostel = require('../model/Hostel');
const Fypfuels = require('../model/Fypfuel.js');
//const Fuelstations = require('../model/Fuel.js');
const multer = require('multer');
const path = require('path');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Authenticatesp = require("../midleware/Authenticationsp");
//const { check, validationResult } = require("express-validator");
const sgMail = require('@sendgrid/mail')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Signup Route


router.post('/spsignup',upload.single("image"), async (req, res) => {
    const { fname,lname,contact, email,address, password,service,lat,lng,shopname,code, codeg } = req.body;
    const image = (req.file) ? req.file.filename : null;
    try {
        if(code !== codeg){
            return res.status(422).send({ message: "Code is not Valid" });
        }else{
            const userExist = await Fypfuels.findOne({ email: email });
            if (userExist) {
                return res.status(422).send({ message: "Email is already exist." });
            } else {
                const user = new Fypfuels({ fname,lname, email,contact,image,shopname,address, password,service,location:{type:"Point", coordinates:[lat,lng]} });
                await user.save();
                return res.status(200).json({ message: "User Created Successfully" });
            }
        }
       
    } catch (error) {
        console.log(error)
    }
})

router.post('/spsignupverify', async (req, res) => {
    const { email } = req.body;
    sgMail.setApiKey('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')
    try {
        function generateRandomNumber() {
            var minm = 100000;
            var maxm = 999999;
            return Math.floor(Math
            .random() * (maxm - minm + 1)) + minm;
          }
          const output = generateRandomNumber();
          console.log(output);
          const msg = {
            to: `${email}`, // Change to your recipient
            from: 'drazumar277@gmail.com', // Change to your verified sender
            subject: ` GetFix Email Verification`,
            text: 'Please verify your email, copy the code.',
            html: `Please verify your email, copy the code.<strong>${output}</strong>`,
          }
          
          sgMail
            .send(msg)
            .then(() => {
              console.log('Email sent')
              res.json({ message: output });
            })
            .catch((error) => {
              console.error(error)
            })
            
    } catch (error) {
        console.log(error)
    }
})


//Signin Route
router.post('/spsignin', async (req, res) => {
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


router.get('/profile', Authenticatesp, async (req, res) => {
    try {
        const profile = await Fypfuels.findById(req.userID);
        //console.log(profile)
        res.json(profile)
        console.log(profile);
    } catch (error) {
        console.log(error);
    }
})
// router.post('/addfuelstation', async (req, res) => {
//     const { fuelstationname,companyname,cnic,mobile,address,lat,lng,country,city} = req.body;    
    
//     try {
//         const item = new Fuelstations({fuelstationname,companyname,mobile, cnic,address,location:{type:"Point", coordinates:[lat,lng]},country,city });
//         const saveitem = await item.save();
//         return res.status(200).json({ message: "Product Added 2345" });
//     } catch (error) {
//         console.log(error);
//     }
// })


module.exports = router;