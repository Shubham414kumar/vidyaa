import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import mongoose, { Document, Schema } from 'mongoose';
import webpush from 'web-push';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL || '';

// --- 1. CONNECT TO MONGODB ---
mongoose.connect(DATABASE_URL)
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas!'))
  .catch((error) => console.error('❌ Error connecting to MongoDB Atlas:', error));

// --- 2. DEFINE TYPES & SCHEMAS ---
interface ISubject extends Document {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  lastMarked: Date | null;
}

interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  subjects: ISubject[];
  pushSubscription?: object;
  createdAt: Date;
}

const subjectSchema = new Schema<ISubject>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    totalClasses: { type: Number, default: 0 },
    attendedClasses: { type: Number, default: 0 },
    lastMarked: { type: Date, default: null }
});

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    subjects: [subjectSchema],
    pushSubscription: { type: Object, default: null },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model<IUser>('User', userSchema);

// --- 3. AUTH HELPERS & MIDDLEWARE ---

// Extend Express Request type to include userId
interface AuthRequest extends Request {
    userId?: string;
}

const createToken = (user: IUser) => jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing or invalid token' });
    const token = auth.replace('Bearer ', '');
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { id: string };
        req.userId = payload.id;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// --- ROUTES ---

// === AUTH ===
app.post('/api/auth/signup', async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            name: name || 'User',
            email,
            phone: phone || null,
            password: hashedPassword,
            subjects: []
        });
        await newUser.save();

        const token = createToken(newUser);
        res.status(201).json({ message: 'Signup successful', token, user: { id: newUser._id, name: newUser.name, email: newUser.email }});
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Server error during signup', error: err.message });
    }
});

app.post('/api/auth/signin', async (req: Request, res: Response) => {
    try {
        const { emailOrPhone, password } = req.body;
        if (!emailOrPhone || !password) return res.status(400).json({ message: 'Email/Phone and password required' });

        const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = createToken(user);
        res.json({ message: 'Signin successful', token, user: { id: user._id, name: user.name, email: user.email }});
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Server error during signin', error: err.message });
    }
});

// === SUBJECTS & ATTENDANCE (protected) ===

app.get('/api/user/subjects', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ subjects: user.subjects || [] });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/user/subjects', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Subject name required' });

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newSubject = {
            id: new mongoose.Types.ObjectId().toString(),
            name,
        };
        user.subjects.push(newSubject as ISubject);
        await user.save();
        
        res.status(201).json({ message: 'Subject added', subject: newSubject });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.delete('/api/user/subjects/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const subjectId = req.params.id;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.subjects = user.subjects.filter(s => s.id !== subjectId) as any;
        await user.save();
        
        res.json({ message: 'Subject removed' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/user/subjects/:id/mark', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const subjectId = req.params.id;
        const { present } = req.body;

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const subject = user.subjects.find(s => s.id === subjectId);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        if (subject.lastMarked) {
            if (Date.now() - new Date(subject.lastMarked).getTime() < 24 * 3600 * 1000) {
                return res.status(400).json({ message: 'Already marked within last 24 hours' });
            }
        }

        subject.totalClasses += 1;
        if (present) {
            subject.attendedClasses += 1;
        }
        subject.lastMarked = new Date();

        await user.save();
        res.json({ message: 'Attendance marked', subject });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Unified backend running on hhttps://backend-1-yuaw.onrender.com`);
});