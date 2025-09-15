const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

const tempUserStore = {};

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(session({ secret: 'vidyasphere_secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// =======================================================
// === 1. MONGODB ATLAS CONNECTION & SCHEMAS =========
// =======================================================
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas!'))
  .catch((error) => console.error('❌ Error connecting to MongoDB Atlas:', error));

// ADDED: Schema for a single subject within a user
const subjectSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    totalClasses: { type: Number, default: 0 },
    attendedClasses: { type: Number, default: 0 },
    lastMarked: { type: Date, default: null }
});

// UPDATED: User schema now includes the subjects array
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true },
    course: { type: String },
    college: { type: String },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    subjects: [subjectSchema] // <-- Subjects are now part of the user
});

const User = mongoose.model('User', userSchema);

// =======================================================
// === 2. AUTH HELPERS & MIDDLEWARE ======================
// =======================================================

// This middleware will protect our attendance routes
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.userId = payload.id; // Attach user's MongoDB ID to the request
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// --- Passport.js Google Strategy (No changes here) ---
passport.use(new GoogleStrategy({
    // ... passport configuration ... (code is unchanged)
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            return done(null, user);
        } else {
            const newUser = new User({
                googleId: profile.id,
                email: profile.emails[0].value,
                fullName: profile.displayName,
                password: null,
                subjects: [] // Ensure new users have an empty subjects array
            });
            await newUser.save();
            return done(null, newUser);
        }
    } catch (error) {
        return done(error, null);
    }
  }
));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// =======================================================
// === 3. USER AUTHENTICATION ROUTES =====================
// =======================================================

// --- Google Auth Routes ---
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login', session: false }),
    function(req, res) {
        const user = req.user;
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
    }
);

// --- OTP Sign-Up Routes ---
app.post('/api/signup-send-otp', async (req, res) => { /* ... code is unchanged ... */ });
app.post('/api/signup-verify-otp', async (req, res) => { /* ... code is unchanged, but now creates a user with an empty subjects array by default ... */ });

// --- Email/Password Sign-In Route ---
app.post('/api/signin', async (req, res) => { /* ... code is unchanged ... */ });

// =======================================================
// === 4. ATTENDANCE TRACKER ROUTES (Protected) ==========
// =======================================================

// Get all subjects for the logged-in user
app.get('/api/user/subjects', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ subjects: user.subjects || [] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new subject for the logged-in user
app.post('/api/user/subjects', authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Subject name is required' });

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newSubject = {
            id: new mongoose.Types.ObjectId().toString(),
            name: name,
        };

        user.subjects.push(newSubject);
        await user.save();
        
        res.status(201).json({ message: 'Subject added successfully', subject: newSubject });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove a subject
app.delete('/api/user/subjects/:id', authMiddleware, async (req, res) => {
    try {
        const subjectId = req.params.id;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.subjects = user.subjects.filter(s => s.id !== subjectId);
        await user.save();

        res.json({ message: 'Subject removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark attendance for a subject
app.post('/api/user/subjects/:id/mark', authMiddleware, async (req, res) => {
    try {
        const subjectId = req.params.id;
        const { present } = req.body; // Expecting { "present": true } or { "present": false }

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const subject = user.subjects.find(s => s.id === subjectId);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        // 24-hour check
        if (subject.lastMarked) {
            const diffMs = Date.now() - new Date(subject.lastMarked).getTime();
            if (diffMs < 24 * 3600 * 1000) {
                return res.status(400).json({ message: 'Already marked within the last 24 hours.' });
            }
        }

        subject.totalClasses += 1;
        if (present) {
            subject.attendedClasses += 1;
        }
        subject.lastMarked = new Date();

        await user.save();
        res.json({ message: 'Attendance marked successfully', subject });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// =======================================================
// === 5. START SERVER ===================================
// =======================================================
app.listen(PORT, () => {
    console.log(`Unified Auth and Attendance server running on http://localhost:${PORT}`);
});