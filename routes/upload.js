const fs = require('fs');
const pdfParse = require('pdf-parse');

app.post('/upload', upload.single('file'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    pdfParse(fileBuffer).then(data => {
        const text = data.text;
        const textFilename = `${req.file.filename}.txt`;
        fs.writeFileSync(`uploads/${textFilename}`, text);
        const downloadLink = `/download/${textFilename}`;
        res.status(200).send(`File uploaded and converted successfully. <a href="${downloadLink}">Download text file</a>`);
    }).catch(next);
});

app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    res.download(path.join('uploads', filename));
});
