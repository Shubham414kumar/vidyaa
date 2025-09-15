const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const uniqid = require('uniqid');
const cors = require('cors');
const mongoose = require('mongoose'); // <-- Added Mongoose

const app = express();
app.use(express.json());
app.use(cors());

// --- 1. MONGODB SETUP ---
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ Payment server connected to MongoDB Atlas!'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

// --- 2. TRANSACTION SCHEMA ---
const transactionSchema = new mongoose.Schema({
    merchantTransactionId: { type: String, required: true, unique: true },
    userId: { type: String, required: false }, // Optional, for linking to a user
    name: { type: String }, // Name of the user or donor
    amount: { type: Number, required: true }, // Amount in Rupees
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILURE'], default: 'PENDING' },
    transactionType: { type: String, enum: ['COURSE_ENROLLMENT', 'DONATION'], required: true },
    courseName: { type: String } // For course enrollments
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

// --- PhonePe API Credentials ---
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_SALT_INDEX = parseInt(process.env.PHONEPE_SALT_INDEX, 10);
const PHONEPE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";

// --- Endpoint for Course Enrollment ---
app.post('/api/pay', async (req, res) => {
    try {
        const { amount, courseName, userId, name } = req.body;
        const merchantTransactionId = uniqid('txn-');

        // CHANGED: Save a pending transaction to the database first
        const newTransaction = new Transaction({
            merchantTransactionId,
            userId,
            name,
            amount,
            transactionType: 'COURSE_ENROLLMENT',
            courseName
        });
        await newTransaction.save();

        const data = {
            merchantId: PHONEPE_MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: userId || 'MUID-' + uniqid(),
            amount: amount * 100, // Amount in paisa
            redirectUrl: `http://localhost:5173/payment-status/${merchantTransactionId}`,
            redirectMode: 'POST',
            callbackUrl: `https://YOUR_LIVE_BACKEND_URL/api/callback`, // <-- IMPORTANT: Use your live server URL
            mobileNumber: '9999999999',
            paymentInstrument: { type: 'PAY_PAGE' }
        };

        const payload = JSON.stringify(data);
        const payloadBase64 = Buffer.from(payload).toString('base64');
        const stringToHash = payloadBase64 + '/pg/v1/pay' + PHONEPE_SALT_KEY;
        const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
        const checksum = sha256 + '###' + PHONEPE_SALT_INDEX;

        const response = await axios.post(`${PHONEPE_HOST_URL}/pg/v1/pay`, { request: payloadBase64 }, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'accept': 'application/json'
            }
        });
        
        res.json({ success: true, redirectUrl: response.data.data.instrumentResponse.redirectInfo.url });

    } catch (error) {
        console.error("PhonePe API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: "Could not initiate payment." });
    }
});

// --- Endpoint for Donations ---
app.post('/api/donate', async (req, res) => {
    try {
        const { amount, name } = req.body;
        const merchantTransactionId = uniqid('donation-txn-');

        // CHANGED: Save a pending donation to the database
        const newDonation = new Transaction({
            merchantTransactionId,
            name,
            amount,
            transactionType: 'DONATION'
        });
        await newDonation.save();
        
        const data = {
            merchantId: PHONEPE_MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: 'DONOR-' + uniqid(),
            amount: amount * 100,
            redirectUrl: `http://localhost:5173/payment-status/${merchantTransactionId}`,
            redirectMode: 'POST',
            callbackUrl: `https://YOUR_LIVE_BACKEND_URL/api/callback`, // <-- IMPORTANT: Use your live server URL
            mobileNumber: '9999999999',
            paymentInstrument: { type: 'PAY_PAGE' }
        };
        
        // The rest of the logic is the same as the /api/pay endpoint
        const payload = JSON.stringify(data);
        const payloadBase64 = Buffer.from(payload).toString('base64');
        const stringToHash = payloadBase64 + '/pg/v1/pay' + PHONEPE_SALT_KEY;
        const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
        const checksum = sha256 + '###' + PHONEPE_SALT_INDEX;

        const response = await axios.post(`${PHONEPE_HOST_URL}/pg/v1/pay`, { request: payloadBase64 }, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'accept': 'application/json'
            }
        });
        
        res.json({ success: true, redirectUrl: response.data.data.instrumentResponse.redirectInfo.url });

    } catch (error) {
        console.error("PhonePe API Error (Donate):", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: "Could not initiate donation." });
    }
});


// --- FULLY FUNCTIONAL CALLBACK ENDPOINT ---
app.post('/api/callback', async (req, res) => {
    try {
        const payload = req.body.response;
        const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
        
        const receivedChecksum = req.headers['x-verify'];
        const stringToHash = payload + PHONEPE_SALT_KEY;
        const calculatedChecksum = crypto.createHash('sha256').update(stringToHash).digest('hex') + '###' + PHONEPE_SALT_INDEX;

        // Verify the checksum to ensure the request is from PhonePe
        if (receivedChecksum !== calculatedChecksum) {
            console.error("Checksum mismatch on callback!");
            return res.status(400).send('Invalid checksum');
        }

        const { merchantTransactionId, code } = decodedPayload;

        const transaction = await Transaction.findOne({ merchantTransactionId });

        if (!transaction) {
            console.error("Transaction not found for callback:", merchantTransactionId);
            return res.status(404).send('Transaction not found');
        }

        // Update transaction status based on the payment code
        if (code === 'PAYMENT_SUCCESS') {
            transaction.status = 'SUCCESS';
        } else {
            transaction.status = 'FAILURE';
        }
        await transaction.save();

        console.log(`Transaction ${merchantTransactionId} updated to ${transaction.status}`);
        res.status(200).send('Callback handled successfully');

    } catch (error) {
        console.error("Error handling callback:", error.message);
        res.status(500).send('Error handling callback');
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Payment server running on http://localhost:${PORT}`);
});