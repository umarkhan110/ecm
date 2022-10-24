const express = require('express')
const router = express.Router();
const Hostel = require('../model/Hostel');
const Hostelusers = require('../model/Hosteluser');
const multer = require('multer');
const path = require('path');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Hostelauthenticate = require("../midleware/Hostelauthentication");
const { check, validationResult } = require("express-validator");
// Signup Route
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.post('/signup', async (req, res) => {
    const { fname, email, password } = req.body;
    try {
        
        const userExist = await Hostelusers.findOne({ email: email });
        if (userExist) {
            return res.status(422).send({ message: "Email is already exist." });
        } else {
            const user = new Hostelusers({ fname, email, password });
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
        const emailExist = await Hostelusers.findOne({ email: email });
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
            }
        } else {
            res.status(400).json({ error: "Wrong Email" });
        }
        if(emailExist.role == 0){
            return res.status(201).send({ message: "User" });
        }else {
            return res.status(202).send({ message: "Admin" });
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/addhostels', upload.single("image"), async (req, res) => {
    const { name,cnic,email,mobile,hostelname,address,lat,lng,country,city,warden,room,security} = req.body;    
    const image = (req.file) ? req.file.filename : null;
    try {
        const item = new Hostel({name, email,mobile, cnic, hostelname,address,location:{type:"Point", coordinates:[lat,lng]},country,city,image, warden, room,security });
        const saveitem = await item.save();
        return res.status(200).json({ message: "Product Added 2345" });
    } catch (error) {
        console.log(error);
    }
})

router.get('/hosteldetail', Hostelauthenticate, async (req, res) => {
    try {
        const items = await Hostel.find();
        res.json(items)
        
    } catch (error) {
        console.log(error);
    }
})

router.get('/hosteldetails', async (req, res) => {
    try {
        const items = await Hostel.find();
        res.json(items)
        
    } catch (error) {
        console.log(error);
    }
})

router.get('/latlng/:lat/:lng', async (req, res) => {
    try {
       //console.log(`djhsghj ${req.params.lat}`)
       //console.log(`djhsghj ${req.params.lng}`)
        const latlng = await Hostel.find(
            {
              location:
                { $near :
                   {
                     $geometry: { type: "Point",  coordinates: [ req.params.lat, req.params.lng ] },
                     $minDistance: 100,
                     $maxDistance: 5000
                   }
                }
            }
         )
        //const latlng = await Hostel.find({lat : req.params.lat});
        res.json(latlng)
        
    } catch (error) {
        console.log(error);
    }
})


router.get('/detail/:id', async (req, res) => {
    try {
        const items = await Hostel.findById( req.params.id);
        res.json(items)
        console.log(items)
    } catch (error) {
        console.log(error);
    }
})

router.put('/approved/:id', async (req, res) => {
    try {
        const hostel = await Hostel.findByIdAndUpdate(req.params.id)
        if(hostel.role === 0){
            const item = await Hostel.findByIdAndUpdate(req.params.id,
                {
                    $set: {
                        "role": "1",
                    }
                },{new:true});
                res.json(item)
        }else{
            return res.status(422).send({ message: "Email is already exist." }); 
        }
        

    } catch (error) {
        console.log(error);
    }
})

module.exports = router;