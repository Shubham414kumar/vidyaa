// upload-server.js

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4000; // Ek alag port use karein, jaise 4000

app.use(cors());

// --- File Storage Setup ---
// Yeh batata hai ki file kahan save hogi
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    // Check if 'uploads' directory exists, if not, create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath); // Files 'uploads/' folder mein save hongi
  },
  filename: function (req, file, cb) {
    // File ka naam unique banane ke liye date add kar rahe hain
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// --- API Endpoint ---
// Yeh woh endpoint hai jise frontend call karega
app.post('/api/upload-pdf', upload.single('pdfFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  // Frontend ko file ka URL wapas bhej rahe hain
  const fileUrl = `https://backend-1-yuaw.onrender.com/uploads/${req.file.filename}`;
  console.log('File uploaded:', fileUrl);
  
  res.json({
    success: true,
    message: 'File uploaded successfully!',
    fileUrl: fileUrl
  });
});

// Statically serve the 'uploads' folder so files can be accessed via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(PORT, () => {
  console.log(`PDF upload server is running on https://backend-1-yuaw.onrender.com`);
});