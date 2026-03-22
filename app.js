document.addEventListener("DOMContentLoaded", () => {
    const landingPage = document.getElementById("landing-page");
    const appDashboard = document.getElementById("app-dashboard");
    const connectNavBtn = document.getElementById("connect-wallet-nav");
    const connectHeroBtn = document.getElementById("connect-wallet-hero");
    const walletAddressDisplay = document.getElementById("wallet-address");

    // Configure Token Gating
    // Replace this with your actual pump.fun Token Mint Address when deployed!
    // Configure Token Gating
    const REQUIRED_TOKEN_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; 
    const REQUIRED_AMOUNT = 0; // Set to 0 for initial testing

    // Configure API Base URL (Change to your production URL later)
    const API_BASE_URL = window.location.hostname === "localhost" ? "http://localhost:3000" : "http://187.124.30.148:3000";

    async function handleConnect() {
        console.log("Connect button clicked");
        
        // Robust wallet detection
        let provider = window.phantom?.solana || window.solana || window.solflare;
        
        if (!provider) {
            alert("No Solana wallet extension detected! Please install & unlock Phantom or Solflare and refresh the page.");
            return;
        }

        // Connection Timeout Logic
        const timeout = setTimeout(() => {
            if (connectNavBtn.textContent === "Connecting...") {
                console.warn("Connection attempt timed out.");
                alert("Connection timed out. Please unlock your wallet and try again.");
                resetButtons();
            }
        }, 15000); // 15 Second Timeout

        try {
            connectNavBtn.textContent = "Connecting...";
            connectHeroBtn.textContent = "Connecting...";
            
            const response = await provider.connect();
            clearTimeout(timeout); // Success! Clear the timer

            const pubKey = response.publicKey.toString();
            console.log("Connected to wallet:", pubKey);

            // If we are in "Testing Mode" (0 tokens required), we unlock instantly
            if (REQUIRED_AMOUNT === 0) {
                unlockDashboard(pubKey);
                return;
            }

            // Otherwise, we perform the token check
            connectHeroBtn.textContent = "Verifying $APEX...";
            const hasAccess = await checkTokenBalance(pubKey);

            if (hasAccess) {
                unlockDashboard(pubKey);
            } else {
                alert(`Access Denied! You need ${REQUIRED_AMOUNT} $APEX to unlock the Pro Engine.`);
                resetButtons();
            }

        } catch (err) {
            console.error("Connection error:", err);
            alert("Failed to connect wallet: " + (err.message || "User rejected request"));
            resetButtons();
        }
    }

    function unlockDashboard(pubKey) {
        landingPage.classList.add("hidden");
        appDashboard.classList.remove("hidden");
        walletAddressDisplay.textContent = `${pubKey.slice(0, 4)}...${pubKey.slice(-4)}`;
        connectNavBtn.textContent = "Connected";
        connectNavBtn.style.color = "var(--primary)";
        connectNavBtn.style.borderColor = "var(--primary)";
    }

    function resetButtons() {
        connectNavBtn.textContent = "Connect Wallet";
        connectHeroBtn.textContent = "Connect to Snatch Alpha";
    }

    async function checkTokenBalance(walletAddress) {
        // Fallback to solana-auth call if available
        if(window.verifyTokenAccess) {
            return await window.verifyTokenAccess(walletAddress, REQUIRED_TOKEN_MINT, REQUIRED_AMOUNT);
        }
        // Basic fallback if solana-auth hasn't loaded (shouldn't happen with 0 required anyway)
        return false;
    }

    connectNavBtn.addEventListener("click", handleConnect);
    connectHeroBtn.addEventListener("click", handleConnect);

    // --- WALLET MANAGEMENT ENGINE ---
    let sessionWallets = [];
    const modeGenBtn = document.getElementById("mode-gen-btn");
    const modeImportBtn = document.getElementById("mode-import-btn");
    const genView = document.getElementById("gen-mode-view");
    const importView = document.getElementById("import-mode-view");
    const genWalletsBtn = document.getElementById("gen-wallets-btn");
    const sessionList = document.getElementById("session-list");
    const sessionActions = document.getElementById("session-actions");

    // Mode Toggling
    modeGenBtn.addEventListener("click", () => {
        modeGenBtn.classList.add("active");
        modeImportBtn.classList.remove("active");
        genView.classList.remove("hidden");
        importView.classList.add("hidden");
    });

    modeImportBtn.addEventListener("click", () => {
        modeImportBtn.classList.add("active");
        modeGenBtn.classList.remove("active");
        genView.classList.add("hidden");
        importView.classList.remove("hidden");
        sessionActions.classList.remove("hidden"); // Show "Ready All" for imports too
    });

    if (genWalletsBtn) {
        genWalletsBtn.addEventListener("click", () => {
            sessionWallets = [];
            sessionList.innerHTML = "";
            for (let i = 0; i < 5; i++) {
                const keypair = solanaWeb3.Keypair.generate();
                sessionWallets.push(keypair);
                const addr = keypair.publicKey.toString();
                
                // Show private key (secret key) encoded for user verification
                // Note: In a real app, this should be handled with extreme care!
                // Using a simple Base58-ish representation or just hex if bs58 unavailable
                const secretKeyArray = Array.from(keypair.secretKey);
                // We'll use a simple indicator or a "Show Key" toggle in UI
                
                const div = document.createElement("div");
                div.className = "session-item";
                div.style.flexDirection = "column";
                div.style.alignItems = "flex-start";
                div.style.gap = "5px";

                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between; width:100%;">
                        <span><b>Wallet ${i+1}:</b> ${addr.slice(0,6)}...${addr.slice(-6)}</span>
                        <span style="color:var(--primary)">0.00 SOL</span>
                    </div>
                    <div class="private-key-container" style="width:100%; font-size:0.7rem; color:var(--text-muted); background:rgba(0,0,0,0.3); padding:5px; border-radius:4px; overflow-x:auto;">
                        <code style="word-break:break-all;">PrivKey: [Hidden Click to Reveal]</code>
                        <button class="btn-mini-reveal" style="background:none; border:1px solid #444; color:#888; cursor:pointer; font-size:0.6rem; padding:2px 5px; margin-left:5px;">Reveal</button>
                    </div>
                `;

                const revealBtn = div.querySelector(".btn-mini-reveal");
                const codeElem = div.querySelector("code");
                
                revealBtn.addEventListener("click", () => {
                    // Simple hex string for now as fallback if bs58 not in browser
                    const hexKey = secretKeyArray.map(b => b.toString(16).padStart(2, '0')).join('');
                    codeElem.textContent = `PrivKey: ${hexKey.slice(0, 16)}... (Hex)`;
                    revealBtn.textContent = "Copy Hex";
                    revealBtn.onclick = () => {
                        navigator.clipboard.writeText(hexKey);
                        alert("Private Key (Hex) copied to clipboard!");
                    };
                });

                sessionList.appendChild(div);
            }
            sessionActions.classList.remove("hidden");
            console.log("5 Session Keypairs Generated:", sessionWallets);
        });
    }

    // Handle Ready / Sign Logic
    document.getElementById("fund-wallets-btn").addEventListener("click", () => {
        if (modeImportBtn.classList.contains("active")) {
            const inputs = document.querySelectorAll(".key-input");
            let count = 0;
            inputs.forEach(input => { if(input.value) count++; });
            alert(`Imported ${count} wallets securely. Apex Engine is now ready to bundle using your private keys locally.`);
        } else {
            alert("Distributing SOL from main wallet to 5 session keys... (Simulated)");
        }
    });

    // --- BACKEND API INTEGRATION ---
    // (Existing listener logic remains below)
    const executeBtns = document.querySelectorAll(".btn-execute");
    
    // Copy-Trade Engine Start
    if (executeBtns[0]) {
        executeBtns[0].addEventListener("click", async (e) => {
            const btn = e.target;
            btn.textContent = "Initiating Engine...";
            try {
                const res = await fetch(`${API_BASE_URL}/api/copy-trade`, {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        targetWallet: "Placeholder_Address", buyAmount: 1.0, tp: 200, sl: 25, frontRunDev: true
                    })
                });
                const data = await res.json();
                btn.textContent = "Engine Active 🟢";
                btn.style.background = "#00ff00";
            } catch(err) {
                btn.textContent = "Server Offline";
            }
        });
    }

    // Jito Quick Snipe & Bundle
    if (executeBtns[1]) {
        executeBtns[1].addEventListener("click", async (e) => {
            const btn = e.target;
            btn.textContent = "Bundling...";
            try {
                const res = await fetch(`${API_BASE_URL}/api/quick-snipe`, {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tokenCA: "Placeholder_CA", amount: 0.5, jitoTip: 0.01
                    })
                });
                btn.textContent = "Bundle Sent ⚡";
                btn.style.background = "#00ff00";
            } catch(err) {
                btn.textContent = "Server Offline";
            }
        });
    }
});
