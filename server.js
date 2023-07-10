const express = require('express');
const morgan = require('morgan');
const multer  = require('multer');
const convertPdfToText = require('./convert');
const fs = require('fs');
const path = require('path');
const upload = multer({ dest: 'uploads/' });

const app = express();

// setup the logger
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/upload', upload.single('file'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    convertPdfToText(req.file.path).then(text => {
        // Save the text to a file, add to a queue, etc.
        res.status(200).send('File uploaded and converted successfully');
    }).catch(next);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
