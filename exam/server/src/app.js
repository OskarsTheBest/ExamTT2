require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

const connectDb = require('./db/db');

const userRoutes = require('./router/users');
const authRoutes = require('./router/auth');
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


const upload = multer({ storage: multer.memoryStorage() });
const videoupload = multer({ dest: 'temp/' });

const resolutions = {
  'nHD': '640x360',
  'FWVGA': '854x480',
  'qHD': '960x540',
  'WSVGA': '1024x576',
  'HD': '1280x720',
  'FWXGA': '1366x768',
  'HD+': '1600x900',
  'FHD': '1920x1080'
};


app.get('/api/getUsers', (req,res) => {
  User.find()
  .then(Users => res.json(Users))
  .catch(err => res.json(err))
})

app.delete('/api/deleteHistory', (req, res) => {
  const { email, entryId } = req.body;

  User.findOneAndUpdate(
    { email },
    { $pull: { history: { _id: entryId } } },
    { new: true }
  )
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    })
    .catch(err => res.status(500).json({ message: 'Error deleting history entry', error: err }));
});

app.delete('/api/deleteUser', async (req, res) => {
  const { email } = req.body;

  try {
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }


    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
});

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
    const token = req.headers.authorization;
    const decodedToken = jwt.decode(token); 
    console.log('Decoded Token:', decodedToken); 
    await updateUserHistory(decodedToken.email, 'Picture Converter', name);
  } catch (error) {
    console.error('Error processing image:', error);
    if (!res.headersSent) {
      res.status(500).send('Error processing image.');
    }
  }
});



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
        const token = req.headers.authorization; 
        console.log("token is",token);
        const decodedToken = jwt.decode(token); 
        console.log('Decoded Token:', decodedToken); 
        await updateUserHistory(decodedToken.email, 'File Converter', req.body.name);
  } catch (error) {
    console.error('Error processing file:', error);
    if (!res.headersSent) {
      res.status(500).send('Error processing file.');
    }
  }
});



app.post('/api/downsize-video', videoupload.single('video'), async (req, res) => {
  const { resolution } = req.body;
  const inputFilePath = req.file.path;
  const outputFileName = `output_${resolution}_${req.file.originalname}`;
  const outputFilePath = path.join(__dirname, 'uploads', outputFileName);
  const resolutionValue = resolutions[resolution];
  if (!resolutionValue) {
    return res.status(400).json({ error: 'Invalid resolution selected.' });
  }
  try {
    // Ensure the output directory exists
    await fs.mkdir(path.join(__dirname, 'uploads'), { recursive: true });
    ffmpeg(inputFilePath)
      .output(outputFilePath)
      .size(resolutionValue)
      .on('error', (err) => {
        console.error('Error:', err.message);
        res.status(500).send('Error processing video.');
      })
      .on('end', async () => {
        console.log('Video downsizing complete!');
        const videoBuffer = await fs.readFile(outputFilePath);
        res.set('Content-Disposition', `attachment; filename="${outputFileName}"`);
        res.set('Content-Type', 'video/mp4');
        res.send(videoBuffer);

        // Update user history
        const token = req.headers.authorization;
        const decodedToken = jwt.decode(token); 
        console.log('Decoded Token:', decodedToken); 
        await updateUserHistory(decodedToken.email, 'Video Downsizer', req.file.originalname);

        // Clean up the temp files
        await fs.unlink(inputFilePath);
        await fs.unlink(outputFilePath);
      })
      .run();
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Error processing video.');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
