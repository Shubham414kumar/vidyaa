const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 5001; // Use a different port from your auth server
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// --- File Storage Setup (Multer) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads/pyqs');
    // Create the directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Helper functions for DB
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// --- API Endpoint to Upload a PYQ PDF ---
app.post('/api/upload-pyq', upload.single('pyqFile'), (req, res) => {
  try {
    const { course, subject, semester, year, paperTitle, hasAnswers } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // --- Save metadata to db.json ---
    const db = readDB();
    const newPyqEntry = {
      id: Date.now().toString(),
      course,
      subject,
      semester,
      year,
      paperTitle,
      hasAnswers: hasAnswers === 'true',
      fileName: file.filename, // The unique name we saved the file as
      originalName: file.originalname,
      filePath: file.path,
      uploadDate: new Date().toISOString(),
      downloads: 0,
      rating: 0,
    };

    if (!db.pyqs) {
      db.pyqs = []; // Initialize the pyqs array if it doesn't exist
    }
    db.pyqs.push(newPyqEntry);
    writeDB(db);
    // --- End of DB save ---

    console.log('File uploaded:', newPyqEntry);
    res.status(200).json({ message: 'File uploaded successfully!', data: newPyqEntry });

  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: 'Server error during file upload.' });
  }
});

app.listen(PORT, () => {
  console.log(`PYQ server is running on https://backend-1-yuaw.onrender.com`);
});