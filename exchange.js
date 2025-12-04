// SA Agri Tokens - Full Exchange Integration with Stellar DEX
// Network: Testnet (change to mainnet for production)

// Token Configuration (LIVE TOKENS!)
const TOKENS = {
    MAIZE: {
        code: "MAIZE",
        issuer: "GCRX44F63XLA4NDO7H6L7JAWAJYW4GP63CHGNOQM4QY4NFIMVZC542WY",
        name: "MAIZE Token",
        icon: "🌽",
        decimals: 7
    },
    WHEAT: {
        code: "WHEAT",
        issuer: "GCGPWVIIRAZNPJNV5LEOMULOTN6PXYW767K6VYTUTSX3UO5S7TC2FVC7",
        name: "WHEAT Token",
        icon: "🌾",
        decimals: 7
    },
    SOYSA: {
        code: "SOYSA",
        issuer: "GCBM5SBKZQUMHIFY4BU7DBIUNHYYZP5ACRQBGBECJX2DKTN5R5EJBAM3",
        name: "SOYSA Token",
        icon: "🫘",
        decimals: 7
    }
};

// Stellar Configuration
const STELLAR_CONFIG = {
    network: 'TESTNET', // Change to 'PUBLIC' for mainnet
    horizonUrl: 'https://horizon-testnet.stellar.org', // Change to horizon.stellar.org for mainnet
    networkPassphrase: 'Test SDF Network ; September 2015' // Change for mainnet
};

// Global state
let walletConnected = false;
let userPublicKey = null;
let stellarServer = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌾 SA Agri Exchange - Initializing...');
    console.log('Network:', STELLAR_CONFIG.network);
    console.log('Tokens loaded:', Object.keys(TOKENS).length);

    // Check if we're using the Stellar SDK from CDN
    if (typeof StellarSdk === 'undefined') {
        console.warn('⚠️ Stellar SDK not loaded via CDN. Some features may be limited.');
    } else {
        stellarServer = new StellarSdk.Server(STELLAR_CONFIG.horizonUrl);
        console.log('✅ Stellar Server connected');
    }

    // Update token info in market cards
    updateTokenInfo();
});

// Connect Wallet Function
document.getElementById('connectWallet')?.addEventListener('click', async () => {
    const button = document.getElementById('connectWallet');
    const statusText = document.getElementById('walletStatus');
    const walletInfo = document.getElementById('walletInfo');
    const addressSpan = document.getElementById('walletAddress');

    try {
        // Check if Freighter is installed
        if (!window.freighter || typeof window.freighter.isConnected !== 'function') {
            alert('Please install Freighter wallet extension first!\n\nGet it at: https://www.freighter.app/');
            window.open('https://www.freighter.app/', '_blank');
            return;
        }

        statusText.textContent = 'Connecting...';
        button.disabled = true;

        // Check if Freighter is connected
        const isConnected = await window.freighter.isConnected();

        if (!isConnected) {
            alert('Please unlock your Freighter wallet first!');
            statusText.textContent = 'Connect Wallet';
            button.disabled = false;
            return;
        }

        // Get network from Freighter
        const network = await window.freighter.getNetwork();
        console.log('Freighter Network:', network);

        if (network !== STELLAR_CONFIG.network) {
            alert(`Please switch Freighter to ${STELLAR_CONFIG.network} network!\n\nCurrent: ${network}\nRequired: ${STELLAR_CONFIG.network}`);
            statusText.textContent = 'Connect Wallet';
            button.disabled = false;
            return;
        }

        // Request access to public key
        const publicKey = await window.freighter.getPublicKey();

        walletConnected = true;
        userPublicKey = publicKey;

        // Update UI
        statusText.textContent = 'Connected ✓';
        button.classList.add('connected');
        button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        walletInfo.style.display = 'block';
        addressSpan.textContent = formatAddress(publicKey);

        console.log('✅ Wallet connected:', publicKey);

        // Load balances
        await loadUserBalances();

        // Enable trading buttons
        enableTradingButtons();

    } catch (error) {
        console.error('Wallet connection error:', error);
        statusText.textContent = 'Connect Wallet';
        button.disabled = false;

        if (error.message && error.message.includes('User declined')) {
            alert('Wallet connection declined. Please try again.');
        } else {
            alert('Failed to connect wallet. Please make sure Freighter is installed and unlocked.');
        }
    }
});

// Format address for display
function formatAddress(address) {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
}

// Load user balances
async function loadUserBalances() {
    if (!userPublicKey || !stellarServer) return;

    try {
        console.log('Loading balances for:', userPublicKey);

        const account = await stellarServer.loadAccount(userPublicKey);

        console.log('Account balances:');
        account.balances.forEach(balance => {
            if (balance.asset_type === 'native') {
                console.log(`  XLM: ${balance.balance}`);
                updateBalanceDisplay('XLM', balance.balance);
            } else {
                const code = balance.asset_code;
                console.log(`  ${code}: ${balance.balance}`);
                updateBalanceDisplay(code, balance.balance);
            }
        });

    } catch (error) {
        console.error('Error loading balances:', error);
        if (error.response?.status === 404) {
            alert('Account not found on Stellar network. Please fund your account with XLM first.');
        }
    }
}

// Update balance display in UI
function updateBalanceDisplay(assetCode, balance) {
    const balanceElements = document.querySelectorAll(`[data-asset="${assetCode}"] .balance-amount`);
    balanceElements.forEach(el => {
        el.textContent = parseFloat(balance).toFixed(4);
    });
}

// Enable trading buttons
function enableTradingButtons() {
    document.querySelectorAll('.btn-trade').forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
    });
}

// Update token info in market cards
function updateTokenInfo() {
    // Update issuer info in cards
    Object.keys(TOKENS).forEach(tokenKey => {
        const token = TOKENS[tokenKey];
        const cards = document.querySelectorAll(`[data-token="${tokenKey}"]`);

        cards.forEach(card => {
            const issuerEl = card.querySelector('.token-issuer');
            if (issuerEl) {
                issuerEl.textContent = formatAddress(token.issuer);
                issuerEl.title = token.issuer;
            }
        });
    });
}

// Open Trade Modal
function openTradeModal(tokenSymbol, action = 'buy') {
    if (!walletConnected) {
        alert('Please connect your wallet first!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    const token = TOKENS[tokenSymbol];
    if (!token) {
        alert('Token not found!');
        return;
    }

    // Create modal
    const modal = createTradeModal(token, action);
    document.body.appendChild(modal);

    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Create trade modal
function createTradeModal(token, action) {
    const modal = document.createElement('div');
    modal.className = 'trade-modal';
    modal.innerHTML = `
        <div class="trade-modal-overlay"></div>
        <div class="trade-modal-content">
            <div class="trade-modal-header">
                <h3>${action === 'buy' ? '🛒' : '💰'} ${action === 'buy' ? 'Buy' : 'Sell'} ${token.name}</h3>
                <button class="modal-close" onclick="closeTradeModal()">&times;</button>
            </div>

            <div class="trade-modal-body">
                <div class="token-info-display">
                    <span class="token-icon-large">${token.icon}</span>
                    <div>
                        <div class="token-name-large">${token.name}</div>
                        <div class="token-code-small">${token.code}</div>
                    </div>
                </div>

                <div class="trade-input-group">
                    <label>Amount (${token.code})</label>
                    <input type="number" id="tradeAmount" class="trade-input" 
                           placeholder="Enter amount" min="0.0000001" step="0.0000001">
                </div>

                <div class="trade-input-group">
                    <label>Price (XLM per ${token.code})</label>
                    <input type="number" id="tradePrice" class="trade-input" 
                           placeholder="Enter price" min="0.0000001" step="0.0000001" value="1.0">
                </div>

                <div class="trade-summary">
                    <div class="summary-row">
                        <span>Total:</span>
                        <span id="tradeTotal">0 XLM</span>
                    </div>
                    <div class="summary-row">
                        <span>Network Fee:</span>
                        <span>~0.00001 XLM</span>
                    </div>
                </div>

                <div class="trade-actions">
                    <button class="btn btn-secondary" onclick="closeTradeModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="executeTrade('${token.code}', '${action}')">
                        ${action === 'buy' ? 'Buy' : 'Sell'} ${token.code}
                    </button>
                </div>

                <div class="trade-info">
                    <p>ℹ️ This creates a limit order on the Stellar DEX.</p>
                    <p>Orders may take time to fill depending on market liquidity.</p>
                </div>
            </div>
        </div>
    `;

    // Add event listeners
    modal.querySelector('#tradeAmount').addEventListener('input', updateTradeTotal);
    modal.querySelector('#tradePrice').addEventListener('input', updateTradeTotal);
    modal.querySelector('.trade-modal-overlay').addEventListener('click', closeTradeModal);

    return modal;
}

// Update trade total
function updateTradeTotal() {
    const amount = parseFloat(document.getElementById('tradeAmount')?.value || 0);
    const price = parseFloat(document.getElementById('tradePrice')?.value || 0);
    const total = amount * price;

    const totalEl = document.getElementById('tradeTotal');
    if (totalEl) {
        totalEl.textContent = `${total.toFixed(7)} XLM`;
    }
}

// Close trade modal
function closeTradeModal() {
    const modal = document.querySelector('.trade-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Execute trade
async function executeTrade(tokenCode, action) {
    if (!walletConnected || !userPublicKey) {
        alert('Please connect your wallet first!');
        return;
    }

    const amount = parseFloat(document.getElementById('tradeAmount')?.value || 0);
    const price = parseFloat(document.getElementById('tradePrice')?.value || 0);

    if (amount <= 0 || price <= 0) {
        alert('Please enter valid amount and price!');
        return;
    }

    const token = TOKENS[tokenCode];
    if (!token) {
        alert('Token not found!');
        return;
    }

    try {
        // Show loading
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Processing...';
        btn.disabled = true;

        // Check if Stellar SDK is available
        if (typeof StellarSdk === 'undefined') {
            throw new Error('Stellar SDK not loaded. Please refresh the page.');
        }

        // Load account
        const account = await stellarServer.loadAccount(userPublicKey);

        // Create asset
        const asset = new StellarSdk.Asset(token.code, token.issuer);
        const baseAsset = StellarSdk.Asset.native(); // XLM

        // Build transaction
        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: STELLAR_CONFIG.networkPassphrase
        })
        .addOperation(
            action === 'buy' 
                ? StellarSdk.Operation.manageBuyOffer({
                    selling: baseAsset,
                    buying: asset,
                    buyAmount: amount.toFixed(7),
                    price: price.toFixed(7)
                })
                : StellarSdk.Operation.manageSellOffer({
                    selling: asset,
                    buying: baseAsset,
                    amount: amount.toFixed(7),
                    price: price.toFixed(7)
                })
        )
        .setTimeout(30)
        .build();

        // Sign with Freighter
        const xdr = transaction.toXDR();
        const signedXDR = await window.freighter.signTransaction(xdr, {
            network: STELLAR_CONFIG.network,
            networkPassphrase: STELLAR_CONFIG.networkPassphrase
        });

        // Submit transaction
        const signedTx = new StellarSdk.Transaction(signedXDR, STELLAR_CONFIG.networkPassphrase);
        const result = await stellarServer.submitTransaction(signedTx);

        // Success!
        console.log('✅ Trade executed:', result);
        alert(`✅ ${action === 'buy' ? 'Buy' : 'Sell'} order created successfully!\n\nTX: ${result.hash.substring(0, 16)}...`);

        // Close modal
        closeTradeModal();

        // Reload balances
        await loadUserBalances();

    } catch (error) {
        console.error('Trade error:', error);
        alert(`❌ Trade failed: ${error.message}\n\nPlease check console for details.`);

        // Restore button
        if (btn) {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }
}

// Add trustline for token
async function addTrustline(tokenCode) {
    if (!walletConnected || !userPublicKey) {
        alert('Please connect your wallet first!');
        return;
    }

    const token = TOKENS[tokenCode];
    if (!token) {
        alert('Token not found!');
        return;
    }

    if (!confirm(`Add trustline for ${token.name}?\n\nThis allows you to receive and hold ${token.code} tokens.`)) {
        return;
    }

    try {
        console.log('Adding trustline for:', tokenCode);

        const account = await stellarServer.loadAccount(userPublicKey);
        const asset = new StellarSdk.Asset(token.code, token.issuer);

        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: STELLAR_CONFIG.networkPassphrase
        })
        .addOperation(StellarSdk.Operation.changeTrust({
            asset: asset,
            limit: '1000000' // Max trust limit
        }))
        .setTimeout(30)
        .build();

        const xdr = transaction.toXDR();
        const signedXDR = await window.freighter.signTransaction(xdr, {
            network: STELLAR_CONFIG.network,
            networkPassphrase: STELLAR_CONFIG.networkPassphrase
        });

        const signedTx = new StellarSdk.Transaction(signedXDR, STELLAR_CONFIG.networkPassphrase);
        const result = await stellarServer.submitTransaction(signedTx);

        console.log('✅ Trustline added:', result);
        alert(`✅ Trustline added for ${token.name}!\n\nYou can now receive ${token.code} tokens.`);

        await loadUserBalances();

    } catch (error) {
        console.error('Trustline error:', error);
        alert(`❌ Failed to add trustline: ${error.message}`);
    }
}

// Export functions for HTML onclick handlers
window.openTradeModal = openTradeModal;
window.closeTradeModal = closeTradeModal;
window.executeTrade = executeTrade;
window.addTrustline = addTrustline;

console.log('🌾 Exchange JS loaded - Ready for trading!');
