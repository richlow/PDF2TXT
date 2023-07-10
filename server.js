const express = require('express');
const multer  = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' });

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Route for the home page
app.get('/', (req, res) => {
    res.render('home');
});

// Route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    // Process the file here...
    res.status(200).send('File uploaded successfully');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
