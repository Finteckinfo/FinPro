# Netlify Deployment - Step by Step Guide

## ✅ Pre-Deployment Checklist

- [x] Git submodule issue fixed (frontend is now a normal directory)
- [x] All required environment variables ready
- [x] WalletConnect Project ID configured
- [x] Supabase database configured
- [x] RPC URLs configured

## Step 1: Commit and Push Git Changes

First, commit the submodule fix:

```bash
cd /home/c0bw3b/FINERP
git add frontend/
git commit -m "Fix: Remove frontend submodule, add as normal directory"
git push origin master
```

**Wait for the push to complete before proceeding to Step 2.**

## Step 2: Create Netlify Site

1. Go to **https://app.netlify.com**
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"GitHub"** (or your Git provider)
4. Authorize Netlify if prompted
5. Select repository: **Finteckinfo/FinERP** (or your repo name)
6. Click **"Connect"**

## Step 3: Configure Build Settings

Netlify should auto-detect settings, but verify:

- **Base directory:** `frontend` (IMPORTANT!)
- **Build command:** `npm run build`
- **Publish directory:** `frontend/dist`

**If auto-detection fails, manually set:**
1. Click **"Show advanced"**
2. Set **Base directory:** `frontend`
3. Set **Build command:** `cd frontend && npm install && npm run build`
4. Set **Publish directory:** `frontend/dist`

## Step 4: Add Environment Variables

1. Before deploying, click **"Show advanced"** → **"New variable"**
2. Or go to **Site settings** → **Environment variables** after site creation
3. Click **"Add multiple"** button
4. Copy and paste ALL variables from the section below:

### Copy This Entire Block:

```bash
VITE_SUPABASE_URL=REPLACE_WITH_YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=REPLACE_WITH_YOUR_SUPABASE_ANON_KEY
VITE_BACKEND_URL=REPLACE_WITH_YOUR_SUPABASE_URL
VITE_API_URL=REPLACE_WITH_YOUR_SUPABASE_URL/rest/v1
VITE_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/REPLACE_WITH_YOUR_ALCHEMY_KEY
VITE_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/REPLACE_WITH_YOUR_ALCHEMY_KEY
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/REPLACE_WITH_YOUR_ALCHEMY_KEY
VITE_WALLETCONNECT_PROJECT_ID=REPLACE_WITH_YOUR_WALLETCONNECT_PROJECT_ID
VITE_ETHERSCAN_API_KEY=REPLACE_WITH_YOUR_ETHERSCAN_API_KEY
```

5. Click **"Save"**

## Step 5: Deploy

1. Click **"Deploy site"** button
2. Wait for build to complete (usually 2-5 minutes)
3. Watch the build logs for any errors

## Step 6: Verify Deployment

1. Once deployed, Netlify will show a URL like: `https://random-name-123.netlify.app`
2. Click the URL to open your site
3. Test:
   - [ ] Page loads without errors
   - [ ] Can connect wallet (MetaMask/WalletConnect)
   - [ ] Can view dashboard
   - [ ] No console errors

## Step 7: Update Domain Variables (After First Deploy)

After you get your Netlify URL, add these two variables:

1. Go to **Site settings** → **Environment variables**
2. Add:
   - `VITE_SSO_PRIMARY_DOMAIN` = `https://your-site-name.netlify.app`
   - `VITE_COOKIE_DOMAIN` = `.netlify.app`
3. Click **"Save"**
4. Go to **Deploys** → **Trigger deploy** → **Deploy site** (to rebuild with new vars)

## Troubleshooting

### Build Fails: "Cannot find module"
- **Fix:** Make sure **Base directory** is set to `frontend`
- **Fix:** Check that `package.json` exists in `frontend/` directory

### Build Fails: "Command not found: npm"
- **Fix:** In **Site settings** → **Build & deploy** → **Environment**, set Node version to `18`

### Build Succeeds but Site Shows Blank Page
- **Fix:** Check **Publish directory** is set to `frontend/dist`
- **Fix:** Check browser console for errors
- **Fix:** Verify all environment variables are set correctly

### Submodule Error Still Appears
- **Fix:** Make sure you committed and pushed the submodule fix (Step 1)
- **Fix:** In Netlify, go to **Site settings** → **Build & deploy** → **Environment** → Uncheck **"Install Git submodules"**

### WalletConnect Not Working
- **Fix:** Verify `VITE_WALLETCONNECT_PROJECT_ID` is set correctly
- **Fix:** Check browser console for WalletConnect errors
- **Fix:** Make sure your Netlify domain is added to WalletConnect Cloud dashboard (if required)

## What's Left to Configure (Optional)

These can be added later:

1. **Gelato Relay** (for gasless transactions)
   - Get API key from: https://relay.gelato.network
   - Add: `VITE_GELATO_RELAY_API_KEY=your-key`
   - Add: `VITE_USE_GASLESS_FAUCET=true`

2. **Block Explorer API Keys** (for transaction history)
   - ✅ Etherscan: Already configured
   - Polygonscan: https://polygonscan.com/myapikey
   - Add: `VITE_POLYGONSCAN_API_KEY=your-key`

3. **Smart Contract Addresses** (after deploying contracts)
   - Deploy contracts to each network
   - Add addresses like: `VITE_FIN_TOKEN_ADDRESS_ETH=0x...`

## Summary

✅ **8 Required Variables:** All configured and ready
✅ **1 Optional Variable:** Etherscan API key added
⏳ **11 Remaining Optional Variables:** Can be added later

**You're ready to deploy!** Follow Steps 1-5 above.

