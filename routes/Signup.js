const express = require('express')
const router = express.Router();
const Users = require('../model/Users');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Authenticate = require("../midleware/Authentication");
const { check, validationResult } = require("express-validator");
// Signup Route

router.post('/signup', [
    check('fname').isLength({ min: 3, max: 15 }).isAlpha().withMessage("Name is required"),
    check('lname').isLength({ min: 3, max: 15 }).isAlpha().withMessage("Name is required"),
    check('email').isEmail().withMessage("Email is required"),
    check('password').isLength({ min: 8 }).isAlphanumeric().withMessage("Password must greater than 8 character"),
], async (req, res) => {
    const { fname, lname, email, password, cpassword } = req.body;
    try {
        const error = validationResult(req);
        // console.log(error.errors[0].msg)
        if (!error.isEmpty()) {
            return res.status(422).send({ message: "Please fill all field." });
        }
        const userExist = await Users.findOne({ email: email });
        if (userExist) {
            return res.status(422).send({ message: "Email is already exist." });
        } else if (password !== cpassword) {
            return res.status(422).send({ message: "Password is not matched." });
        } else {
            const user = new Users({ fname, lname, email, password, cpassword });
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
        const emailExist = await Users.findOne({ email: email });
        if (emailExist) {
            const passMatch = await bcrypt.compare(password, emailExist.password);
            token = await emailExist.generateAuthToken();
            console.log( "ya token ha abahi " + token)
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 9000000),
                httpOnly: true
            });
            if (!passMatch) {
                res.status(400).json({ error: "Password is not correct" })
            } else {
                res.json({ message: "Login Successfully" });
            }
        } else {
            res.status(400).json({ error: "Wrong Email" });
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;