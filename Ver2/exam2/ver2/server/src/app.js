require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');
const ffmpeg = require('ffmpeg-static');
const { exec } = require('child_process');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
const connectDb = require('./db/db');
const userRoutes = require('./router/users');
const authRoutes = require('./router/auth');
const emailRoutes = require('./router/email');
const { User, validate } = require('./models/user')

const updateUserHistory = require('./methods/history');
const port = 5000;

// db connection
connectDb();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", emailRoutes);


const upload = multer({ storage: multer.memoryStorage() });

app.get('/api/getUsers', (req,res) => {
  User.find()
  .then(Users => res.json(Users))
  .catch(err => res.json(err))
})
// Inside your /api/convert-image endpoint
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

    // Update user history
    const token = req.headers.authorization; // Get token from Authorization header
    const decodedToken = jwt.decode(token); // Decode token to get user info
    console.log('Decoded Token:', decodedToken); // Check decoded token
    await updateUserHistory(decodedToken.email, 'Picture Converter', req.body.name);

  } catch (error) {
    console.error('Error processing image:', error);
    if (!res.headersSent) {
      res.status(500).send('Error processing image.');
    }
  }
});


// File conversion endpoint
app.post('/api/convert-file', upload.single('file'), async (req, res) => {
  const { format, name } = req.body;
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const convertedFileBuffer = await libre.convertAsync(uploadedFile.buffer, `.${format}`, undefined);

    res.set('Content-Disposition', `attachment; filename="${name || 'converted_file'}.${format}"`);
    res.set('Content-Type', 'application/pdf');
    res.send(convertedFileBuffer);
        // Update user history
        const token = req.headers.authorization; // Get token from Authorization header
        const decodedToken = jwt.decode(token); // Decode token to get user info
        console.log('Decoded Token:', decodedToken); // Check decoded token
        await updateUserHistory(decodedToken.email, 'File Converter', req.body.name);
    
  } catch (error) {
    console.error('Error processing file:', error);
    if (!res.headersSent) {
      res.status(500).send('Error processing file.');
    }
  }
});

// Video downsizing endpoint
app.post('/api/convert-video', upload.single('video'), (req, res) => {
  const { resolution } = req.body;
  const video = req.file;

  if (!video) {
    return res.status(400).send('No video uploaded.');
  }

  const resolutions = {
    '1080p': '1920x1080',
    '720p': '1280x720',
    '480p': '854x480',
    '360p': '640x360',
    '240p': '426x240',
    '144p': '256x144',
  };

  const outputPath = `./uploads/downsized_${path.parse(video.originalname).name}.mp4`;

  const ffmpegCommand = `"${ffmpeg.path}" -i "${video.path}" -vf scale=${resolutions[resolution]} "${outputPath}"`;

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error processing video:', error);
      if (!res.headersSent) {
        res.status(500).send('Error processing video.');
      }
      return;
    }

    res.download(outputPath, (err) => {
      if (err) {
        console.error('Error downloading video:', err);
        if (!res.headersSent) {
          res.status(500).send('Error downloading video.');
        }
      } else {
        // Delete the file after sending it to the client
        fs.unlinkSync(outputPath);
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
