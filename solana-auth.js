const solanaWeb3 = window.solanaWeb3;

// Configure RPC
// Using a public mainnet endpoint for demonstration.
const connection = new solanaWeb3.Connection("https://api.mainnet-beta.solana.com");

/**
 * Verifies if a wallet holds the required minimum balance of a specific SPL token
 */
window.verifyTokenAccess = async function(walletAddressStr, tokenMintStr, requiredAmount) {
    try {
        const walletPublicKey = new solanaWeb3.PublicKey(walletAddressStr);
        const tokenMint = new solanaWeb3.PublicKey(tokenMintStr);

        console.log(`Checking balance for ${walletAddressStr} on mint ${tokenMintStr}`);

        // Get all token accounts for the wallet
        const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
            walletPublicKey,
            { mint: tokenMint }
        );

        if (parsedTokenAccounts.value.length === 0) {
            console.log("No token account found for this mint.");
            return false;
        }

        let totalBalance = 0;
        for (const accountInfo of parsedTokenAccounts.value) {
            const tokenAmount = accountInfo.account.data.parsed.info.tokenAmount;
            totalBalance += parseFloat(tokenAmount.uiAmount);
        }

        console.log(`Found balance: ${totalBalance}`);

        return totalBalance >= requiredAmount;
    } catch (error) {
        console.error("Error checking token balance (might be RPC rate limit):", error);
        return false; 
    }
};
