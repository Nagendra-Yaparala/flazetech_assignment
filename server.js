const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Dummy database for storing OTPs
const otpDatabase = {};

// Login page
app.get('/', (req, res) => {
  res.render('login');
});

// OTP generation and email sending
app.post('/send-otp', (req, res) => {
  const email = req.body.email;

  // Generate a random OTP (for simplicity, use a 6-digit number)
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Store the OTP in the database
  otpDatabase[email] = otp;
  console.log('Generated OTP:', otp);

  // Send the OTP to the user's email (this is a simplified example)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yaparalanagendra0391@gmail.com',
      pass: 'jwvp ikzd oiup dyeg'
    }
  });

  const mailOptions = {
    from: 'yaparalanagendra0391@gmail.com',
    to: email,
    subject: 'OTP for Login',
    text: `Your OTP for login is: ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Failed to send OTP.');
    } else {
      console.log('Email sent: ' + info.response);
      res.render('otp', { email });
    }
  });
});

// OTP verification
app.post('/verify-otp', (req, res) => {
  const email = req.body.email;
  const userEnteredOTP = req.body.otp;

  console.log('User Entered OTP:', userEnteredOTP);
  console.log('Stored OTP for', email + ':', otpDatabase[email]);

  // Check if the entered OTP matches the one stored in the database
  if (otpDatabase[email] && otpDatabase[email] == userEnteredOTP) {
    // Successful login
    res.render('home', { email });
  } else {
    console.log('Comparison result:', otpDatabase[email] === userEnteredOTP);
    res.status(401).send('Invalid OTP. Please try again.');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
