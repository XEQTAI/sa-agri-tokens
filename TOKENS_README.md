# 🌾 SA Agri Tokens - Stellar Blockchain Tokens

## 🎉 Successfully Created Tokens!

Your agricultural commodity tokens are now **LIVE on Stellar Testnet**!

---

## 📊 Token Summary

### 🌽 MAIZE Token
- **Code:** MAIZE
- **Description:** White Maize Token - 1 token = 1 ton of SA white maize
- **Issuer:** `GCRX44F63XLA4NDO7H6L7JAWAJYW4GP63CHGNOQM4QY4NFIMVZC542WY`
- **Supply:** 10,000 MAIZE tokens
- **Explorer:** https://stellar.expert/explorer/testnet/tx/a04b23e0fd9f66fb62236e8910f6a60c116e8848455eec089c11cbaae51e1774

### 🌾 WHEAT Token
- **Code:** WHEAT
- **Description:** Wheat Token - 1 token = 1 ton of SA milling wheat
- **Issuer:** `GCGPWVIIRAZNPJNV5LEOMULOTN6PXYW767K6VYTUTSX3UO5S7TC2FVC7`
- **Supply:** 10,000 WHEAT tokens
- **Explorer:** https://stellar.expert/explorer/testnet/tx/8dfb4f557fea8306a8f83696e0217ba9abe1f2e0fa943b3eb3bb222ebd289639

### 🫘 SOYSA Token
- **Code:** SOYSA
- **Description:** Soybean Token - 1 token = 1 ton of SA soybeans
- **Issuer:** `GCBM5SBKZQUMHIFY4BU7DBIUNHYYZP5ACRQBGBECJX2DKTN5R5EJBAM3`
- **Supply:** 10,000 SOYSA tokens
- **Explorer:** https://stellar.expert/explorer/testnet/tx/82cbde6a45316bcb717e3b87a5639377846b0a658e74791840c8869880e0c0a9

---

## 🔑 Account Details

### Testnet vs Mainnet
- ✅ **Currently on:** Stellar **TESTNET** (free, for testing)
- 💰 **Mainnet cost:** ~$2 total (1 XLM ≈ $0.10)

### Security
⚠️ **CRITICAL:** Keep these secret keys secure! Anyone with access can control the tokens.

---

## 🚀 How to Use

### Check Token Balances
```bash
python manage_tokens.py
```

### Issue More Tokens
```python
issue_more_tokens('MAIZE', 5000)  # Issue 5,000 more MAIZE
```

### Transfer Tokens
```python
transfer_tokens('MAIZE', 'RECIPIENT_PUBLIC_KEY', 100)
```

---

## 🌐 View on Stellar Expert

Visit these URLs to see your tokens live:

- **MAIZE:** https://stellar.expert/explorer/testnet/tx/a04b23e0fd9f66fb62236e8910f6a60c116e8848455eec089c11cbaae51e1774
- **WHEAT:** https://stellar.expert/explorer/testnet/tx/8dfb4f557fea8306a8f83696e0217ba9abe1f2e0fa943b3eb3bb222ebd289639
- **SOYSA:** https://stellar.expert/explorer/testnet/tx/82cbde6a45316bcb717e3b87a5639377846b0a658e74791840c8869880e0c0a9

---

## 📱 Trading Your Tokens

Users can trade your tokens on:
1. **StellarTerm:** https://stellarterm.com
2. **StellarX:** https://stellarx.com
3. **Your Exchange:** https://xeqtai.github.io/sa-agri-tokens/exchange.html

---

## 🔄 Moving to Mainnet

When ready for production:

1. Change server to mainnet:
   ```python
   server = Server("https://horizon.stellar.org")
   network_passphrase = Network.PUBLIC_NETWORK_PASSPHRASE
   ```

2. Fund accounts with real XLM (~1 XLM per account)
3. Re-run token issuance
4. Update website with mainnet issuer addresses

**Cost:** ~$2 total for all 6 accounts

---

## 📁 Files Included

- `stellar_accounts.json` - All account keys (KEEP SECURE!)
- `issued_tokens.json` - Token issuance records
- `manage_tokens.py` - Management script

---

## 🎯 Next Steps

1. ✅ Integrate token addresses into your website
2. ✅ Build full exchange functionality
3. ✅ Add real-time price tracking
4. ✅ Create investor dashboard
5. 🚀 Deploy to mainnet when ready

---

## 🔒 Security Best Practices

1. **Never commit secret keys to GitHub**
2. Store keys in environment variables
3. Use a hardware wallet for mainnet
4. Enable 2FA on all accounts
5. Regularly backup keys securely

---

**Built on Stellar Network** | **Testnet Active** | **Ready for Trading**

🌾 Bringing Blockchain to South African Agriculture
