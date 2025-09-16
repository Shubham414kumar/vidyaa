// server.js

const path = require("path");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
const axios = require("axios");
const uniqid = require("uniqid");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(session({ secret: "vidyasphere_secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// =======================================================
// === 1. MONGODB CONNECTION =============================
// =======================================================
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("✅ Connected to MongoDB Atlas!"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// =======================================================
// === 2. SCHEMAS ========================================
// =======================================================

// Subject schema
const subjectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  totalClasses: { type: Number, default: 0 },
  attendedClasses: { type: Number, default: 0 },
  lastMarked: { type: Date, default: null },
});

// User schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true, sparse: true },
  course: { type: String },
  college: { type: String },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  subjects: [subjectSchema],
});

const User = mongoose.model("User", userSchema);

// Transaction schema (Payment)
const transactionSchema = new mongoose.Schema(
  {
    merchantTransactionId: { type: String, required: true, unique: true },
    userId: { type: String },
    name: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["PENDING", "SUCCESS", "FAILURE"], default: "PENDING" },
    transactionType: { type: String, enum: ["COURSE_ENROLLMENT", "DONATION"], required: true },
    courseName: { type: String },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

// =======================================================
// === 3. AUTH HELPERS ===================================
// =======================================================
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid authorization header" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// =======================================================
// === 4. PASSPORT GOOGLE STRATEGY =======================
// =======================================================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://backend-1-yuaw.onrender.com/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);
        const newUser = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          fullName: profile.displayName,
          password: null,
          subjects: [],
        });
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

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
// === 5. AUTH ROUTES ====================================
// =======================================================
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "https://vidyasphere.online/login", session: false }),
  function (req, res) {
    const user = req.user;
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.redirect(`https://vidyasphere.online/auth/callback?token=${token}`);
  }
);

// =======================================================
// === 6. ATTENDANCE ROUTES ==============================
// =======================================================
app.get("/api/user/subjects", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ subjects: user.subjects || [] });
});

app.post("/api/user/subjects", authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Subject name is required" });

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const newSubject = { id: new mongoose.Types.ObjectId().toString(), name: name };
  user.subjects.push(newSubject);
  await user.save();

  res.status(201).json({ message: "Subject added successfully", subject: newSubject });
});

// =======================================================
// === 7. FILE UPLOADS (PDF + PYQ) =======================
// =======================================================

const uploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "uploads/");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: uploadStorage });

app.post("/api/upload-pdf", upload.single("pdfFile"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded." });

  const fileUrl = `https://backend-1-yuaw.onrender.com/uploads/${req.file.filename}`;
  res.json({ success: true, message: "File uploaded successfully!", fileUrl });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =======================================================
// === 8. PAYMENT ROUTES (PhonePe) =======================
// =======================================================

const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_SALT_INDEX = parseInt(process.env.PHONEPE_SALT_INDEX, 10);
const PHONEPE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";

app.post("/api/pay", async (req, res) => {
  try {
    const { amount, courseName, userId, name } = req.body;
    const merchantTransactionId = uniqid("txn-");

    const newTransaction = new Transaction({
      merchantTransactionId,
      userId,
      name,
      amount,
      transactionType: "COURSE_ENROLLMENT",
      courseName,
    });
    await newTransaction.save();

    const data = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: userId || "MUID-" + uniqid(),
      amount: amount * 100,
      redirectUrl: `https://backend-1-yuaw.onrender.com/payment-status/${merchantTransactionId}`,
      redirectMode: "POST",
      callbackUrl: `https://backend-1-yuaw.onrender.com/api/callback`,
      mobileNumber: "9999999999",
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const payloadBase64 = Buffer.from(JSON.stringify(data)).toString("base64");
    const stringToHash = payloadBase64 + "/pg/v1/pay" + PHONEPE_SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
    const checksum = sha256 + "###" + PHONEPE_SALT_INDEX;

    const response = await axios.post(`${PHONEPE_HOST_URL}/pg/v1/pay`, { request: payloadBase64 }, {
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        accept: "application/json",
      },
    });

    res.json({ success: true, redirectUrl: response.data.data.instrumentResponse.redirectInfo.url });
  } catch (err) {
    console.error("Payment Error:", err.message);
    res.status(500).json({ success: false, message: "Payment initiation failed" });
  }
});

// =======================================================
// === 9. START SERVER ===================================
// =======================================================
app.listen(PORT, () => {
  console.log(`🚀 Unified server running on https://backend-1-yuaw.onrender.com (PORT ${PORT})`);
});
