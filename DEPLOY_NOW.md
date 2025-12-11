# 🚀 DEPLOY TO NETLIFY - Step by Step Instructions

## ✅ Pre-Flight Checklist

Before you start, make sure:
- [x] Git submodule issue fixed
- [x] All 9 environment variables ready
- [x] You have a GitHub account
- [x] Your code is pushed to GitHub

---

## STEP 1: Commit and Push Git Changes

**IMPORTANT:** Do this first to fix the submodule issue!

1. Open your terminal
2. Run these commands:

```bash
cd /home/c0bw3b/FINERP
git add frontend/
git commit -m "Fix: Remove frontend submodule, add as normal directory"
git push origin master
```

3. **Wait for the push to complete** (you'll see "Everything up-to-date" or similar)

---

## STEP 2: Go to Netlify

1. Open your browser
2. Go to: **https://app.netlify.com**
3. **Sign in** with GitHub (or create account if needed)

---

## STEP 3: Create New Site

1. Click the **"Add new site"** button (top right)
2. Select **"Import an existing project"**
3. Click **"Deploy with GitHub"** (or your Git provider)
4. **Authorize Netlify** if prompted (click "Authorize Netlify")

---

## STEP 4: Select Your Repository

1. In the repository list, find and click: **Finteckinfo/FinERP** (or your repo name)
2. Click **"Connect"** or **"Import"**

---

## STEP 5: Configure Build Settings

Netlify will show build settings. **IMPORTANT:** Set these exactly:

### Base directory:
```
frontend
```

### Build command:
```
npm run build
```

### Publish directory:
```
frontend/dist
```

**If you don't see these fields:**
1. Click **"Show advanced"** or **"Change settings"**
2. Set them manually as shown above

---

## STEP 6: Add Environment Variables

**BEFORE clicking "Deploy site":**

1. Click **"Show advanced"** → **"New variable"**
2. Or click **"Add variable"** button
3. Click **"Add multiple"** (if available) for faster entry
4. Copy and paste **ALL 9 variables** from the box below:

### 📋 COPY THIS ENTIRE BLOCK:

```
VITE_SUPABASE_URL=https://haslirlxxyrllbaytwop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhc2xpcmx4eHlybGxiYXl0d29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NjI0MzUsImV4cCI6MjA4MTAzODQzNX0.Y19eGEHxorYxoQCT7rgHsrLboccQGpLQ6qb78EzFQx0
VITE_BACKEND_URL=https://haslirlxxyrllbaytwop.supabase.co
VITE_API_URL=https://haslirlxxyrllbaytwop.supabase.co/rest/v1
VITE_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/FKZHDvByL0evFDiWtKzFy
VITE_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/FKZHDvByL0evFDiWtKzFy
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/FKZHDvByL0evFDiWtKzFy
VITE_WALLETCONNECT_PROJECT_ID=4e7282ceda516b26364a9827eeb51559
VITE_ETHERSCAN_API_KEY=FGQHSYTAWKZ8B9FPJGM8631UCBGV27Q2KK
```

5. Click **"Save"** or **"Add variables"**

---

## STEP 7: Deploy!

1. Click the big **"Deploy site"** button
2. **Wait for deployment** (2-5 minutes)
3. Watch the build logs for any errors

---

## STEP 8: Check Build Logs

While building, you'll see:
- ✅ Installing dependencies
- ✅ Building project
- ✅ Deploying site

**If you see errors:**
- Check the error message
- Common fixes are in the Troubleshooting section below

---

## STEP 9: Get Your Site URL

Once deployment completes:
1. You'll see: **"Site is live"**
2. Your site URL will be: `https://random-name-123.netlify.app`
3. **Click the URL** to open your site
4. **Copy the URL** - you'll need it for Step 10

---

## STEP 10: Add Domain Variables (After First Deploy)

1. Go to **Site settings** (gear icon ⚙️)
2. Click **"Environment variables"** in left sidebar
3. Click **"Add variable"**
4. Add these two variables:

**Variable 1:**
- **Key:** `VITE_SSO_PRIMARY_DOMAIN`
- **Value:** `https://your-site-name.netlify.app` (use your actual URL from Step 9)

**Variable 2:**
- **Key:** `VITE_COOKIE_DOMAIN`
- **Value:** `.netlify.app`

5. Click **"Save"**
6. Go to **"Deploys"** tab
7. Click **"Trigger deploy"** → **"Deploy site"** (to rebuild with new vars)

---

## STEP 11: Test Your Site

Open your site and test:
- [ ] Page loads without errors
- [ ] Can see the dashboard/login page
- [ ] Can connect MetaMask wallet
- [ ] Can connect WalletConnect
- [ ] No console errors (press F12 to check)

---

## 🆘 Troubleshooting

### Build Fails: "Cannot find module"
**Fix:** Make sure **Base directory** is set to `frontend`

### Build Fails: "Command not found: npm"
**Fix:** 
1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Set **Node version** to `18`

### Build Succeeds but Site is Blank
**Fix:** 
1. Check **Publish directory** is `frontend/dist`
2. Check browser console (F12) for errors
3. Verify all environment variables are set

### Submodule Error Still Appears
**Fix:**
1. Make sure you completed Step 1 (git push) with the latest fix
2. In Netlify: **Site settings** → **Build & deploy** → **Build settings**
3. Scroll down to **"Advanced build settings"**
4. Find **"Install Git submodules"** and make sure it's **UNCHECKED** (disabled)
5. Click **"Save"**
6. Go to **Deploys** tab → **Trigger deploy** → **Deploy site**

### WalletConnect Not Working
**Fix:**
1. Verify `VITE_WALLETCONNECT_PROJECT_ID` is correct
2. Check browser console for errors
3. Make sure your Netlify domain is allowed in WalletConnect Cloud (if required)

---

## ✅ Success Checklist

After deployment, you should have:
- ✅ Site is live at `https://your-site.netlify.app`
- ✅ All 9 environment variables set
- ✅ Can connect wallets
- ✅ No console errors
- ✅ Dashboard loads

---

## 📊 What You've Deployed

**9 Environment Variables:**
- ✅ Supabase (4)
- ✅ RPC URLs (3)
- ✅ WalletConnect
- ✅ Etherscan API

**Remaining Optional (11):**
- Polygonscan API key
- Gelato Relay (gasless transactions)
- Smart contract addresses (after deployment)

---

## 🎉 You're Done!

Your FinERP frontend is now live on Netlify!

**Next Steps:**
1. Test all features
2. Deploy smart contracts (when ready)
3. Add remaining optional variables (as needed)
4. Set up custom domain (optional)

---

## Quick Reference

**Netlify Dashboard:** https://app.netlify.com
**Your Site:** https://your-site-name.netlify.app (after deployment)
**Environment Variables:** Site settings → Environment variables
**Build Logs:** Deploys tab → Click on any deploy

---

**Need Help?** Check the build logs in Netlify for specific error messages.

