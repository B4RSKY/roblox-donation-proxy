const express = require('express');
const app = express();

app.use(express.json());

let allDonations = [];
let lastSentIndex = 0;

app.get('/', (req, res) => {
    res.send('Server Proxy Saweria-Roblox Aktif');
});

// hook dari saweria
app.post('/saweria-webhook', (req, res) => {
    console.log('='.repeat(60));
    console.log('[WEBHOOK] Donation received!');
    
    const donorName = req.body.donator_name || req.body.name || 'Donatur';
    const amountRaw = req.body.amount_raw || req.body.amount || 0;
    const donorMsg = req.body.message || '';

    console.log('[WEBHOOK] Name:', donorName);
    console.log('[WEBHOOK] Amount:', amountRaw);
    console.log('[WEBHOOK] Message:', donorMsg);
    
    allDonations.push({
        name: donorName,
        amount: amountRaw,
        message: donorMsg,
        timestamp: new Date().toISOString()
    });
    
    console.log('[WEBHOOK] Total donations:', allDonations.length);
    console.log('='.repeat(60));
    
    res.status(200).send("OK");
});

// donation check roblox
app.get('/check-donations', (req, res) => {
    console.log('[CHECK] Roblox checking...');
    console.log('[CHECK] Total donations:', allDonations.length);
    console.log('[CHECK] Last sent index:', lastSentIndex);
    
    if (lastSentIndex < allDonations.length) {
        const donation = allDonations[lastSentIndex];
        lastSentIndex++;
        
        console.log('[CHECK] Sending donation #' + lastSentIndex);
        console.log('[CHECK] Donor:', donation.name);
        console.log('[CHECK] Amount:', donation.amount);
        
        res.json({
            hasNewDonation: true,
            donatorName: donation.name,
            amount: donation.amount,
            message: donation.message
        });
    } else {
        console.log('[CHECK] no new donations');
        res.json({ hasNewDonation: false });
    }
});

app.get('/status', (req, res) => {
    res.json({
        status: 'running',
        totalDonations: allDonations.length,
        lastSentIndex: lastSentIndex,
        unsent: allDonations.length - lastSentIndex,
        donations: allDonations
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log(`[SERVER] Running on port ${PORT}`);
    console.log('[SERVER] Endpoints:');
    console.log('[SERVER]   POST /saweria-webhook - Receive from Saweria');
    console.log('[SERVER]   GET /check-donations - Check by Roblox');
    console.log('[SERVER]   GET /status - Check queue status');
    console.log('='.repeat(60));
});
