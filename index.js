const express = require('express');
const app = express();

app.use(express.json());

// Store semua donasi
let allDonations = [];
let lastSentIndex = 0;

console.log('[START] Donation server started');

// ========== RUTE UTAMA (Mencegah Error di Browser) ==========
app.get('/', (req, res) => {
    res.send('Server Proxy Saweria-Roblox Aktif dan Berjalan!');
});

// ========== WEBHOOK DARI SAWERIA ==========
app.post('/saweria-webhook', (req, res) => {
    console.log('='.repeat(60));
    console.log('[WEBHOOK] Donation received!');
    console.log('[WEBHOOK] Name:', req.body.name);
    console.log('[WEBHOOK] Amount:', req.body.amount);
    console.log('[WEBHOOK] Message:', req.body.message);
    
    allDonations.push({
        name: req.body.name || 'Donatur',
        amount: req.body.amount || 0,
        message: req.body.message || '',
        timestamp: new Date().toISOString()
    });
    
    console.log('[WEBHOOK] Total donations:', allDonations.length);
    console.log('='.repeat(60));
    
    res.status(200).send("OK");
});

// ========== CHECK DONASI UNTUK ROBLOX ==========
app.get('/check-donations', (req, res) => {
    console.log('[CHECK] Roblox checking...');
    console.log('[CHECK] Total donations:', allDonations.length);
    console.log('[CHECK] Last sent index:', lastSentIndex);
    
    if (lastSentIndex < allDonations.length) {
        const donation = allDonations[lastSentIndex];
        lastSentIndex++;
        
        console.log('[CHECK] ✅ Sending donation #' + lastSentIndex);
        console.log('[CHECK] Donor:', donation.name);
        console.log('[CHECK] Amount:', donation.amount);
        
        res.json({
            hasNewDonation: true,
            donatorName: donation.name,
            amount: donation.amount,
            message: donation.message
        });
    } else {
        console.log('[CHECK] ❌ No new donations');
        res.json({ hasNewDonation: false });
    }
});

// ========== STATUS ENDPOINT ==========
app.get('/status', (req, res) => {
    res.json({
        status: 'running',
        totalDonations: allDonations.length,
        lastSentIndex: lastSentIndex,
        unsent: allDonations.length - lastSentIndex,
        donations: allDonations
    });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log(`[SERVER] ✅ Running on port ${PORT}`);
    console.log('[SERVER] Endpoints:');
    console.log('[SERVER]   POST /saweria-webhook - Receive from Saweria');
    console.log('[SERVER]   GET /check-donations - Check by Roblox');
    console.log('[SERVER]   GET /status - Check queue status');
    console.log('='.repeat(60));
});