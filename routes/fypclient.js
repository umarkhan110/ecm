const express = require('express')
const router = express.Router();
const distance = require('distance-matrix-api');
//const Hostel = require('../model/Hostel');
const Fypclients = require('../model/Fypclient.js');
const Fuelstations =  require('../model/Fuel.js');
const Fypfuels = require('../model/Fypfuel.js');
const multer = require('multer');
const path = require('path');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require('@sendgrid/mail')
const Authenticate = require("../midleware/Authentication");
const { check, validationResult } = require("express-validator");
const Recentorder = require('../model/Recentorder.js');
const Authenticatesp = require('../midleware/Authenticationsp.js');

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

router.post('/customersignup',upload.single("image"), async (req, res) => {
    const { customerfname,customerlname,contact, email, password, code, codeg } = req.body;
    const image = (req.file) ? req.file.filename : null;
    try {
        if(code !== codeg){
            return res.status(422).send({ message: "Code is not Valid" });
        }else{
            const userExist = await Fypclients.findOne({ email: email });
            if (userExist) {
                return res.status(422).send({ message: "Email is already exist." });
            } else {
                const user = new Fypclients({  customerfname,customerlname,contact, email, password, image });
                await user.save();
                return res.status(200).json({ message: "User Created Successfully" });
            }
        }
        
    } catch (error) {
        console.log(error)
    }
})

router.post('/customersignupverify', async (req, res) => {
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
router.post('/customersignin', async (req, res) => {
    const { email, password } = req.body;
    try {
        let token;
        if (!email || !password) {
            return res.status(400).json({ error: "plz fill the filled" })
        }
        const emailExist = await Fypclients.findOne({ email: email });
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


router.get('/latlng/:lat/:lng', async (req, res) => {
    try {
       console.log(`djhsghj ${req.params.lat}`)
       console.log(`djhsghj ${req.params.lng}`)
        const latlng = await Fypfuels.find(
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
        console.log(latlng[0].service)
    } catch (error) {
        console.log(error);
    }
})

router.get('/fueldelivery/:lat/:lng',Authenticate, async (req, res) => {
    try {
       console.log(`djhsghj ${req.params.lat}`)
       console.log(`fuel ${req.params.lng}`)
        const latlng = await Fypfuels.find(
            {
              location:
                { $near :
                   {
                     $geometry: { type: "Point",  coordinates: [ req.params.lat, req.params.lng ] },
                     $minDistance: 100,
                     $maxDistance: 5000
                   }
                },
                service:"Fuel Provider"
            }
         )
         console.log(latlng.length)
         if(latlng.length > 0){
            res.json(latlng)
         }else{
            res.status(422).json({ message: "This Service is not avalibale" });
         }
        //const latlng = await Hostel.find({lat : req.params.lat});
        
        
    } catch (error) {
        console.log(error);
    }
})

router.get('/mechanic/:lat/:lng', Authenticate, async (req, res) => {
    try {
       console.log(`djhsghj ${req.params.lat}`)
       console.log(`mechn ${req.params.lng}`)
        const latlng = await Fypfuels.find(
            {
              location:
                { $near :
                   {
                     $geometry: { type: "Point",  coordinates: [ req.params.lat, req.params.lng ] },
                     $minDistance: 100,
                     $maxDistance: 5000
                   }
                },
                service:"Mechanic"
            }
         )
         console.log(latlng.length)
         if(latlng.length > 0){
            res.json(latlng)
         }else{
            res.status(422).json({ message: "This Service is not avalibale" });
         }
        //const latlng = await Hostel.find({lat : req.params.lat});
        
        
    } catch (error) {
        console.log(error);
    }
})

router.get('/latlng/:lat/:lng/:service', async (req, res) => {
    try {
       console.log(`djhsghj ${req.params.lat}`)
       console.log(`djhsghj ${req.params.lng}`)
        const latlng = await Fypfuels.find(
            {
              location:
                { $near :
                   {
                     $geometry: { type: "Point",  coordinates: [ req.params.lat, req.params.lng ] },
                     $minDistance: 100,
                     $maxDistance: 5000
                   }
                },
                service:req.params.service
            }
         )
         console.log(latlng.length)
         if(latlng.length > 0){
            res.json(latlng)
         }else{
            res.status(422).json({ message: "This Service is not avalibale" });
         }
         
        //const latlng = await Hostel.find({lat : req.params.lat});
        
        
    } catch (error) {
        console.log(error);
    }
})

router.get('/detail/:id', async (req, res) => {
    try {
        const items = await Fypfuels.findById( req.params.id);
        res.json(items)
        console.log(items)
    } catch (error) {
        console.log(error);
    }
})


// Create New order
router.post('/recentorder', async (req, res) => {
    const { customerfname,customerlname, service, id ,_id} = req.body;
    try {
       
        const order = new Recentorder({customerfname,customerlname,service, user: id , client: _id});
        const ordersave = await order.save();
        //res.json(saveblog)
        return res.status(200).json({ message: "Order Added" });
    } catch (error) {
        console.log(error);
    }
})



router.get('/cldetail', Authenticate, async (req, res) => {
    try {
        console.log(req.userID)
        const cl = await Fypclients.findById(req.userID);
        res.json(cl)
    } catch (error) {
        console.log(error);
    }
})


router.get('/rcorder', Authenticatesp, async (req, res) => {
    try {
        const rcorder = await Recentorder.find({ user: req.userID });
        res.json(rcorder)
    } catch (error) {
        console.log(error);
    }
})



router.put('/status/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        const order = await Recentorder.find({client:req.params.id})
        if(order.role === 0){
            const item = await Recentorder.findOneAndUpdate({client:req.params.id},
                {
                    $set: {
                        "role": "1",
                    }
                },{new:true});
               const abc =  res.json(item)
                console.log(abc)
        }else{
            return res.status(422).send({ message: "Already Completed" }); 
        }
        

    } catch (error) {
        console.log(error);
    }
})
// distance.key('AIzaSyAxLuIqOTuNOAKTf21WzItkcet51uU99Ts');
// distance.units('imperial');
// router.get('/profile', async (req, res) => {
//     const origins = ['San Francisco CA', '40.7421,-73.9914'];
// const destinations = ['New York NY', 'Montreal', '41.8337329,-87.7321554', 'Honolulu'];
//     try {
        
//  const umd = await distance.matrix(origins, destinations, function (err, distances) {
//     if (distances.status == 'OK') {
//         for (var i=0; i < origins.length; i++) {
//             for (var j = 0; j < destinations.length; j++) {
//                 var origin = distances.origin_addresses[i];
//                 var destination = distances.destination_addresses[j];
//                 if (distances.rows[0].elements[j].status == 'OK') {
//                     var distance = distances.rows[i].elements[j].distance.text;
//                     res.json(distance)
//                     console.log('Distance from ' + origin + ' to ' + destination + ' is ' + distance);
//                 } else {
//                     console.log(destination + ' is not reachable by land from ' + origin);
//                 }
//             }
//         }
//     }else{
//         console.log("tara")
//     }
// })

//        // res.json(profile)
//         //console.log(profile);
//     } catch (error) {
//         console.log(error);
//     }
// })

module.exports = router;