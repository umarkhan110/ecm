const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const PORT = 5000;
const cors = require("cors");
const sgMail = require('@sendgrid/mail')
app.use(cors());
app.use(express.json());
app.use(cookieParser());



sgMail.setApiKey('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')
function generateRandomNumber() {
  var minm = 100000;
  var maxm = 999999;
  return Math.floor(Math
  .random() * (maxm - minm + 1)) + minm;
}
const output = generateRandomNumber();
console.log(output);
const msg = {
  to: 'bsf1801789@ue.edu.pk', // Change to your recipient
  from: 'drazumar277@gmail.com', // Change to your verified sender
  subject: ` GetFix Email Verification`,
  text: 'Please verify your email, copy the code.',
  html: `Please verify your email, copy the code.<strong>${output}</strong>`,
}

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })

//app.use("/fypf", require("./routes/fypfuel.js"));

app.listen(PORT, () => { console.log("Port is listening  ") });