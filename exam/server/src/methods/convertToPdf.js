const PDFDocument = require('pdfkit');

const convertToPdf = async (textBuffer) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.text(textBuffer.toString('utf8'));
    doc.end();
  });
};

module.exports = { convertToPdf };
