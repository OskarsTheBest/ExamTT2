require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');
const app = express();
const connectDb = require('./db/db');
const userRoutes = require('./router/users')
const authRoutes = require('./router/auth');
const port = 5000;

//db connection
connectDb();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/users",userRoutes);
app.use("/api/auth", authRoutes);

const upload = multer({ storage: multer.memoryStorage() });

// Image conversion endpoint
app.post('/api/convert-image', upload.single('image'), async (req, res) => {
  const { format, width, height, name } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(400).send('No image uploaded.');
  }

  try {
    let convertedImage = sharp(image.buffer);
    if (width || height) {
      convertedImage = convertedImage.resize(
        width ? parseInt(width, 10) : null,
        height ? parseInt(height, 10) : null
      );
    }
    const saveBuffer = await convertedImage.toFormat(format).toBuffer();
    res.set('Content-Disposition', `attachment; filename="${name || 'converted_image'}.${format}"`);
    res.set('Content-Type', `image/${format === 'jpg' ? 'jpeg' : format}`);
    res.send(saveBuffer);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image.');
  }
});

app.post('/api/convert-file', upload.single('file'), async (req, res) => {
  const { format, name } = req.body;
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    let convertedFileBuffer;

    // Example: Convert text file to PDF
    if (format === 'pdf' && uploadedFile.mimetype === 'text/plain') {
      const text = uploadedFile.buffer.toString('utf-8');
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      page.drawText(text, { x: 50, y: 750 });
      convertedFileBuffer = await pdfDoc.save();
    } else {
      return res.status(400).send('Unsupported file type or format');
    }

    res.set('Content-Disposition', `attachment; filename="${name || 'converted_file'}.${format}"`);
    res.set('Content-Type', 'application/pdf');
    res.send(convertedFileBuffer);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
