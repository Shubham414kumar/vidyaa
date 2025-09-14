// server.js
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const webpush = require('web-push');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const PORT = process.env.PORT || 5000;

// Web-push VAPID keys (optional)
const VAPID_PUBLIC = process.env.VAPID_PUBLIC || '';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE || '';
if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:you@example.com',
    VAPID_PUBLIC,
    VAPID_PRIVATE
  );
}

// --- Simple DB helpers (file-based) ---
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
}
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// --- Auth helpers ---
const createToken = (user) => jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Missing authorization header' });
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// --- Utility: compute percentage & needed classes to reach 75% ---
const attendancePercentage = (attended, total) => (total === 0 ? 0 : (attended / total) * 100);
const classesNeededToReach = (attended, total, target = 75) => {
  if (total === 0) {
    // if zero classes so far, min classes to reach 75% is 3 attendances out of 4 etc.
    // We'll compute by simulation: find smallest n such that (attended + n) / (total + n) >= target/100
  }
  const targetFrac = target / 100;
  if ((attended / (total || 1)) >= targetFrac) return 0;
  // Solve for n: (attended + n) / (total + n) >= targetFrac
  // => attended + n >= targetFrac*(total + n) => n*(1-targetFrac) >= targetFrac*total - attended
  const numerator = targetFrac * total - attended;
  const denom = 1 - targetFrac;
  return Math.max(0, Math.ceil(numerator / denom));
};

// --- ROUTES ---

// Health
app.get('/', (req, res) => res.json({ ok: true }));

// === AUTH ===
// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const db = readDB();
    if (db.users.find(u => u.email === email || (phone && u.phone === phone))) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name: name || '',
      email,
      phone: phone || '',
      password: hashed,
      subjects: [], // each subject: { id, name, totalClasses, attendedClasses, lastMarked (ISO string) }
      pushSubscription: null, // optional web-push subscription object
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeDB(db);

    const token = createToken(newUser);
    res.json({ message: 'signup ok', token, user: { id: newUser.id, name: newUser.name, email: newUser.email }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// Signin
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) return res.status(400).json({ message: 'emailOrPhone and password required' });

    const db = readDB();
    const user = db.users.find(u => u.email === emailOrPhone || u.phone === emailOrPhone);
    if (!user) return res.status(400).json({ message: 'user not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'invalid credentials' });

    const token = createToken(user);
    res.json({ message: 'signin ok', token, user: { id: user.id, name: user.name, email: user.email }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// === SUBJECTS & ATTENDANCE (protected) ===

// Get all subjects for current user + stats
app.get('/api/user/subjects', authMiddleware, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'user not found' });

  // compute per-subject percentage and needed classes
  const subjects = user.subjects.map(s => {
    const pct = attendancePercentage(s.attendedClasses, s.totalClasses);
    const needed = classesNeededToReach(s.attendedClasses, s.totalClasses, 75);
    return { ...s, percentage: Number(pct.toFixed(2)), neededToReach75: needed };
  });

  // overall
  const totalClassesAll = subjects.reduce((a, b) => a + b.totalClasses, 0);
  const totalAttendedAll = subjects.reduce((a, b) => a + b.attendedClasses, 0);
  const overallPct = totalClassesAll === 0 ? 0 : Number(((totalAttendedAll / totalClassesAll) * 100).toFixed(2));

  res.json({ subjects, overall: { totalClassesAll, totalAttendedAll, overallPct }});
});

// Add subject
app.post('/api/user/subjects', authMiddleware, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'subject name required' });

  const db = readDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'user not found' });

  const newSubject = {
    id: Date.now().toString(),
    name,
    totalClasses: 0,
    attendedClasses: 0,
    lastMarked: null // ISO string
  };
  user.subjects.push(newSubject);
  writeDB(db);
  res.json({ message: 'subject added', subject: newSubject });
});

// Remove subject
app.delete('/api/user/subjects/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'user not found' });

  user.subjects = user.subjects.filter(s => s.id !== id);
  writeDB(db);
  res.json({ message: 'subject removed' });
});

// Mark attendance (present/absent). Enforce 24-hour rule per subject
app.post('/api/user/subjects/:id/mark', authMiddleware, (req, res) => {
  const sid = req.params.id;
  const { present } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'user not found' });

  const subject = user.subjects.find(s => s.id === sid);
  if (!subject) return res.status(404).json({ message: 'subject not found' });

  // check lastMarked
  const now = Date.now();
  if (subject.lastMarked) {
    const last = new Date(subject.lastMarked).getTime();
    const diffMs = now - last;
    if (diffMs < 24 * 3600 * 1000) {
      const remain = 24 * 3600 * 1000 - diffMs;
      return res.status(400).json({ message: 'Already marked within last 24 hours', retryAfterMs: remain });
    }
  }

  subject.totalClasses = (subject.totalClasses || 0) + 1;
  subject.attendedClasses = (subject.attendedClasses || 0) + (present ? 1 : 0);
  subject.lastMarked = new Date().toISOString();

  // save DB
  writeDB(db);

  // return updated subject + stats
  const pct = Number(attendancePercentage(subject.attendedClasses, subject.totalClasses).toFixed(2));
  const needed = classesNeededToReach(subject.attendedClasses, subject.totalClasses, 75);
  // overall
  const totalClassesAll = user.subjects.reduce((a, b) => a + b.totalClasses, 0);
  const totalAttendedAll = user.subjects.reduce((a, b) => a + b.attendedClasses, 0);
  const overallPct = totalClassesAll === 0 ? 0 : Number(((totalAttendedAll / totalClassesAll) * 100).toFixed(2));

  // optional: send push notification if user has subscription
  if (user.pushSubscription && VAPID_PUBLIC && VAPID_PRIVATE) {
    const payload = JSON.stringify({
      title: 'Attendance Updated',
      body: `${subject.name}: marked ${present ? 'Present' : 'Absent'} — ${pct}% now. Overall: ${overallPct}%`
    });
    webpush.sendNotification(user.pushSubscription, payload).catch(err => {
      console.warn('push send failed', err && err.message);
    });
  }

  res.json({
    message: 'marked',
    subject: { ...subject, percentage: pct, neededToReach75: needed },
    overall: { totalClassesAll, totalAttendedAll, overallPct }
  });
});

// --- Web push subscription (optional) ---
app.post('/api/user/subscribe', authMiddleware, (req, res) => {
  const subscription = req.body.subscription;
  if (!subscription) return res.status(400).json({ message: 'subscription required' });

  const db = readDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'user not found' });

  user.pushSubscription = subscription;
  writeDB(db);
  res.json({ message: 'subscribed' });
});

// Admin/test endpoint: send daily notification to all users (call from cron or manually)
app.post('/api/notify/daily', (req, res) => {
  const db = readDB();
  const results = [];
  db.users.forEach(user => {
    if (!user.pushSubscription || !VAPID_PUBLIC || !VAPID_PRIVATE) {
      results.push({ user: user.email, pushed: false, reason: 'no-sub-or-no-vapid' });
      return;
    }
    // prepare message: compute user overall
    const totalClassesAll = user.subjects.reduce((a,b)=> a + b.totalClasses, 0);
    const totalAttendedAll = user.subjects.reduce((a,b)=> a + b.attendedClasses, 0);
    const overallPct = totalClassesAll === 0 ? 0 : Number(((totalAttendedAll / totalClassesAll) * 100).toFixed(2));
    const payload = JSON.stringify({
      title: 'Daily Attendance Summary',
      body: `Overall: ${overallPct}%. Subjects: ${user.subjects.length}`,
    });
    webpush.sendNotification(user.pushSubscription, payload).then(() => {
      results.push({ user: user.email, pushed: true });
    }).catch(err => {
      results.push({ user: user.email, pushed: false, error: err.message });
    });
  });

  res.json({ results });
});

app.listen(PORT, () => {
  console.log(`Attendance backend running on http://localhost:${PORT}`);
});
