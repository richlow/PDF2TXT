const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const convertPdfToText = require('./convert');
const fs = require('fs');
const path = require('path');
const upload = multer({ dest: 'uploads/' });

console.log('server.js called');

const app = express();

// setup the logger
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

app.set('view engine', 'ejs');
app.use(express.static('public'));

//grab the URL (for the terms and conditions)
app.get('/terms-of-service', (req, res) => {
  const currentUrl = req.url;
  // Pass the currentUrl as a variable to the "terms" view
  res.render('terms-of-service', { currentUrl });
});

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));

// CSP header
//app.use((req, res, next) => {
//  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'");
//  next();
//});

// Routes
app.get('/', (req, res) => {
  // Get the forwarded IP address from the 'X-Forwarded-For' header
  const userIP = req.body.userIP;
  console.log('User IP received on the server:', userIP);

  res.render('home', { message: null, filename: null });
});

//app.get('/terms-of-service', (req, res) => {
  //res.sendFile(path.join(__dirname, 'terms-of-service.ejs'));
//  res.render('terms-of-service', { message: null, filename: null });
//});

app.get('/confetti', (req, res) => {
  res.sendFile(path.join(__dirname, 'confetti.html'));
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'privacy-policy.html'));
});

// Contact Me Form
app.get('/contact-me', (req, res) => {
  res.render('contact-me', { message: null });
});

app.post('/contact-me', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  // Customize the email subject and recipient
  const to = 'richlow+PDF2TXT@gmail.com';
  const subject = 'New Contact Form Submission';
  const body = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

  console.log(`New email. Name: ${name}, Email: ${email}, Message: ${message}`);

  // Code to send the email using your preferred method or library

  // Redirect to the main page after sending the email
  res.redirect('/');
});

// File Upload and Conversion
let conversionCounts = {};
const CONVERSION_LIMIT = 5; // Set your limit here

app.post('/upload', upload.single('file'), (req, res, next) => {
  const clientIp = req.ip; // Get client's IP address

  // Increment conversion count for this IP
  if (!conversionCounts[clientIp]) {
    conversionCounts[clientIp] = 0;
  }
  conversionCounts[clientIp]++;

  // Check if the conversion limit for this IP has been reached
  if (conversionCounts[clientIp] > CONVERSION_LIMIT) {
    return res.status(429).send('Daily limit reached');
  }

  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  convertPdfToText(req.file.path)
    .then((text) => {
      const textFilename = `${req.file.filename}.txt`;
      fs.writeFileSync(path.join('uploads', textFilename), text);
      const downloadLink = `/uploads/${textFilename}`;

      res.json({
        message: 'File uploaded and converted successfully',
        filename: textFilename,
        downloadLink: downloadLink,
      });
    })
    .catch(next);
});

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  res.download(path.join('uploads', filename));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
