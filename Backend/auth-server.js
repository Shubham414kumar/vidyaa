const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const twilio = require('twilio');

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
const DB_PATH = path.join(__dirname, 'db.json');

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(session({ secret: 'vidyasphere_secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// --- Clients and Helpers ---
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
const tempUserStore = {};

// --- Passport.js Google Strategy ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    const db = readDB();
    let user = db.users.find(u => u.googleId === profile.id);
    if (user) {
        return done(null, user);
    } else {
        const newUser = { id: Date.now().toString(), googleId: profile.id, email: profile.emails[0].value, fullName: profile.displayName, password: null };
        db.users.push(newUser);
        writeDB(db);
        return done(null, newUser);
    }
  }
));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    const user = readDB().users.find(u => u.id === id);
    done(null, user);
});

// --- ROUTES ---

// 1. Google Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login', session: false }),
  function(req, res) {
    const user = req.user;
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  });

// 2. OTP Sign-Up Routes
app.post('/api/signup-send-otp', async (req, res) => {
    try {
        const { name, email, phone, course, college, password } = req.body;
        const db = readDB();
        if (db.users.find(user => user.email === email || user.phone === phone)) {
            return res.status(400).json({ message: 'User with this email or phone already exists.' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        tempUserStore[phone] = { name, email, phone, course, college, password: hashedPassword, otp, timestamp: Date.now() };
        
        // Temporarily disabled for testing without Twilio
        console.log(`\n--- OTP for ${phone} is: ${otp} ---\n`);
        res.status(200).json({ message: 'OTP sent successfully (to terminal).' });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: 'Failed to send OTP.' });
    }
});
app.post('/api/signup-verify-otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const tempUser = tempUserStore[phone];
        if (!tempUser) return res.status(400).json({ message: 'Session expired.' });
        
        const otpExpiryTime = 5 * 60 * 1000; // 5 minutes
        if (Date.now() - tempUser.timestamp > otpExpiryTime) {
            delete tempUserStore[phone];
            return res.status(400).json({ message: 'OTP has expired.' });
        }
        if (tempUser.otp !== otp) return res.status(400).json({ message: 'Invalid OTP.' });

        const db = readDB();
        const newUser = { id: Date.now().toString(), fullName: tempUser.name, email: tempUser.email, phone: tempUser.phone, course: tempUser.course, college: tempUser.college, password: tempUser.password };
        db.users.push(newUser);
        writeDB(db);
        delete tempUserStore[phone];
        res.status(201).json({ message: 'Account created successfully!' });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: 'Server error during verification.' });
    }
});

// 3. Email/Password Sign-In Route
app.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Please provide email and password.' });

        const user = readDB().users.find(u => u.email === email);
        if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        const userToReturn = { id: user.id, email: user.email, fullName: user.fullName };
        res.json({ message: 'Logged in successfully!', token, user: userToReturn });
    } catch (error) {
        res.status(500).json({ message: 'Server error during sign-in.' });
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Auth server is running on http://localhost:${PORT}`);
});