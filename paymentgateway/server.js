// Ab Aisa Karein:
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const uniqid = require('uniqid');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- PhonePe API Credentials ---
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_SALT_INDEX = parseInt(process.env.PHONEPE_SALT_INDEX);
const PHONEPE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";

// --- Endpoint for Course Enrollment ---
app.post('/api/pay', async (req, res) => {
    try {
        const { amount, courseName, userId } = req.body;
        const merchantTransactionId = uniqid('txn-');

        const data = {
            merchantId: PHONEPE_MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: userId || 'MUID-' + uniqid(),
            amount: amount * 100, // Amount in paisa
            redirectUrl: `http://localhost:5173/payment-status/${merchantTransactionId}`,
            redirectMode: 'POST',
            callbackUrl: 'https://your-backend-url.com/api/callback',
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
        
        const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
        res.json({ success: true, redirectUrl });

    } catch (error) {
        console.error("PhonePe API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: "Could not initiate payment." });
    }
});


// --- NEWLY ADDED: Endpoint for Donations ---
app.post('/api/donate', async (req, res) => {
    try {
        const { amount, name, course, college } = req.body;
        const merchantTransactionId = uniqid('donation-txn-');

        const data = {
            merchantId: PHONEPE_MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: 'DONOR-' + uniqid(), // A unique ID for the donor
            amount: amount * 100, // Amount in paisa
            redirectUrl: `http://localhost:5173/payment-status/${merchantTransactionId}`,
            redirectMode: 'POST',
            callbackUrl: 'https://your-backend-url.com/api/callback',
            mobileNumber: '9999999999', // Can be optional or collected from form
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
        
        const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
        res.json({ success: true, redirectUrl });

    } catch (error) {
        console.error("PhonePe API Error (Donate):", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: "Could not initiate donation." });
    }
});


// Callback endpoint (remains the same)
app.post('/api/callback', (req, res) => {
    console.log("Received callback from PhonePe:", req.body);
    res.send('Callback received');
});

const PORT = 3001; // Port for the payment gateway
app.listen(PORT, () => {
    console.log(`Payment server running on http://localhost:${PORT}`);
});