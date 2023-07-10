const fs = require('fs');
const pdfParse = require('pdf-parse');

function convertPdfToText(path) {
    return new Promise((resolve, reject) => {
        const pdfFile = fs.readFileSync(path);

        pdfParse(pdfFile).then(data => {
            resolve(data.text);
        }).catch(reject);
    });
}

module.exports = convertPdfToText;
