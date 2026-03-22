const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// API: Jito Quick Snipe
app.post('/api/quick-snipe', async (req, res) => {
    const { tokenCA, amount, jitoTip, walletsToBundle } = req.body;
    console.log(`\n[API] Received Jito Snipe Request for ${tokenCA}`);
    console.log(`Amount: ${amount} SOL | Tip: ${jitoTip} SOL | Bundle Config: ${walletsToBundle}`);
    
    // TODO: Import your existing Python/Node sniper logic here!
    // Example: await executeJitoBundle(tokenCA, amount, jitoTip, walletsToBundle);

    res.json({ success: true, message: "Jito Bundle Sent to Block Engine." });
});

// API: Start Copy-Trade Engine
app.post('/api/copy-trade', async (req, res) => {
    const { targetWallet, buyAmount, tp, sl, frontRunDev } = req.body;
    console.log(`\n[API] Starting Copy Trade Engine on Wallet: ${targetWallet}`);
    console.log(`Config -> AutoBuy: ${buyAmount} SOL | TP: ${tp}% | SL: ${sl}% | FrontRunDev: ${frontRunDev}`);
    
    // TODO: Import your existing websocket/RPC listener here to watch the Target Wallet!
    // Example: startWalletListener(targetWallet, config);

    res.json({ success: true, message: `Now listening to ${targetWallet}...` });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] Omni-Sniper Backend running on http://localhost:${PORT}`);
    console.log(`[SYS] Bridged to Dashboard successfully. Awaiting commands...`);
});
