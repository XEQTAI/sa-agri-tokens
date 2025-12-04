// Exchange Page JavaScript

let walletConnected = false;
let userPublicKey = null;

// Connect Wallet Function
document.getElementById('connectWallet')?.addEventListener('click', async () => {
    const button = document.getElementById('connectWallet');
    const statusText = document.getElementById('walletStatus');
    const walletInfo = document.getElementById('walletInfo');
    const addressSpan = document.getElementById('walletAddress');

    try {
        // Check if Freighter is installed
        if (typeof window.freighter === 'undefined') {
            alert('Please install Freighter wallet extension first!\n\nGet it at: https://www.freighter.app/');
            window.open('https://www.freighter.app/', '_blank');
            return;
        }

        statusText.textContent = 'Connecting...';
        button.disabled = true;

        // Request access to Freighter
        const publicKey = await window.freighter.getPublicKey();

        walletConnected = true;
        userPublicKey = publicKey;

        // Update UI
        statusText.textContent = 'Connected ✓';
        button.classList.add('connected');
        walletInfo.style.display = 'block';
        addressSpan.textContent = publicKey.substring(0, 8) + '...' + publicKey.substring(publicKey.length - 8);

        console.log('Wallet connected:', publicKey);

    } catch (error) {
        console.error('Wallet connection error:', error);
        statusText.textContent = 'Connect Wallet';
        button.disabled = false;

        if (error.message.includes('User declined')) {
            alert('Wallet connection declined. Please try again.');
        } else {
            alert('Failed to connect wallet. Please make sure Freighter is installed and unlocked.');
        }
    }
});

// Open Trade Modal (placeholder)
function openTradeModal(tokenSymbol) {
    if (!walletConnected) {
        alert('Please connect your wallet first!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // Placeholder - will integrate with Stellar SDK
    alert(`Trading interface for ${tokenSymbol} coming soon!\n\nFor now, you can trade on:\n- StellarTerm: https://stellarterm.com\n- StellarX: https://stellarx.com`);
}

// Simulate real-time price updates
function updateMarketPrices() {
    const marketCards = document.querySelectorAll('.market-card');

    marketCards.forEach(card => {
        const priceElement = card.querySelector('.price');
        const changeElement = card.querySelector('.change');

        if (priceElement && changeElement) {
            // Get current price
            const currentPriceText = priceElement.textContent;
            const currentPrice = parseFloat(currentPriceText.replace(/[^0-9.]/g, ''));

            // Random variation (-2% to +2%)
            const variation = (Math.random() - 0.5) * 0.04 * currentPrice;
            const newPrice = currentPrice + variation;
            const changePercent = ((variation / currentPrice) * 100).toFixed(2);

            // Update price
            priceElement.textContent = `R ${newPrice.toFixed(2)}`;

            // Update change
            const isPositive = changePercent > 0;
            changeElement.textContent = `${isPositive ? '+' : ''}${changePercent}%`;
            changeElement.className = `change ${isPositive ? 'positive' : 'negative'}`;
        }
    });
}

// Update prices every 10 seconds (demo)
if (document.querySelector('.market-card')) {
    setInterval(updateMarketPrices, 10000);
}

// Check for Freighter on page load
window.addEventListener('load', () => {
    if (typeof window.freighter === 'undefined') {
        console.log('Freighter wallet not detected');
    } else {
        console.log('Freighter wallet detected ✓');
    }
});

console.log('🌾 Exchange page loaded successfully!');