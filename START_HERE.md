# START HERE - Manual Setup Instructions

Since automated shell commands are encountering issues, please follow these manual steps:

## Step-by-Step Setup

### 1. Open a Terminal
Open a new terminal window (outside of Cursor if needed)

### 2. Navigate to Frontend Directory
```bash
cd /home/c0bw3b/.cursor/worktrees/FINERP/sbf/frontend
```

### 3. Check if Dependencies are Installed
```bash
ls -la node_modules/ 2>/dev/null | head -5
```

If you see "No such file or directory", continue to step 4.
If you see folders listed, skip to step 5.

### 4. Install Dependencies (if needed)
```bash
npm ci --legacy-peer-deps
```

**Expected output:**
- Should take 2-3 minutes
- Will install ~500 packages
- Should end with "added XXX packages"

**If it fails with peer dependency errors:**
```bash
npm install --legacy-peer-deps --force
```

### 5. Check Environment File
```bash
ls -la .env
```

**If file doesn't exist**, create it:
```bash
cp .env.example .env 2>/dev/null || cat > .env << 'EOF'
# Minimal configuration for local development
VITE_SSO_PRIMARY_DOMAIN=http://localhost:5173
VITE_COOKIE_DOMAIN=localhost

# WalletConnect (get free project ID from https://cloud.walletconnect.com/)
VITE_WALLETCONNECT_PROJECT_ID=

# Optional: Add these for full functionality
# VITE_SUPABASE_URL=
# VITE_SUPABASE_ANON_KEY=
# VITE_BACKEND_URL=
# VITE_ETHEREUM_RPC_URL=https://eth.llamarpc.com
# VITE_POLYGON_RPC_URL=https://polygon-rpc.com
# VITE_SEPOLIA_RPC_URL=https://rpc.sepolia.org
EOF
```

### 6. Start Development Server
```bash
npm run dev
```

**Expected output:**
```
  VITE v6.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 7. Open in Browser
Open your browser and navigate to:
```
http://localhost:5173
```

You should see the FinERP landing page!

---

## What You Should See

### Landing Page Features:
1. **Hero Section** - "Welcome to FinERP" with gradient background
2. **Features Grid** - Modern bento-grid layout
3. **Navigation Bar** - Logo, "Connect Wallet" button
4. **Responsive Design** - Works on mobile and desktop

### Try These Actions:
1. Click "Connect Wallet" in the top right
2. Select MetaMask or WalletConnect
3. Connect your wallet
4. You'll be redirected to the Dashboard

---

## Troubleshooting

### Issue: "npm: command not found"
```bash
# Check Node.js installation
node --version
npm --version

# If not installed, install Node.js 18+
# Visit: https://nodejs.org/
```

### Issue: "Port 5173 already in use"
```bash
# Option 1: Kill the existing process
pkill -f vite

# Option 2: Use a different port
npm run dev -- --port 5174
```

### Issue: "Cannot find module '@vitejs/plugin-vue'"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Issue: Browser shows blank page
1. Open DevTools (Press F12)
2. Check Console tab for errors
3. Common fixes:
   - Clear browser cache (Ctrl+Shift+Delete)
   - Hard reload (Ctrl+Shift+R)
   - Check if `.env` file exists
   - Verify env vars start with `VITE_`

### Issue: "Failed to fetch" or API errors
- This is expected if you haven't configured backend URLs
- The app will work with wallet features
- For full functionality, add Supabase credentials to `.env`

---

## Verification Checklist

Once the server is running, verify these work:

- [ ] Page loads at http://localhost:5173
- [ ] Landing page displays correctly
- [ ] Navigation bar is visible
- [ ] "Connect Wallet" button works
- [ ] No console errors (minor warnings OK)
- [ ] Responsive design works (resize browser)

### Advanced Testing (requires wallet + backend):
- [ ] Wallet connection (MetaMask/WalletConnect)
- [ ] Login/authentication
- [ ] Dashboard loads
- [ ] Navigate to "Boards" (Kanban)
- [ ] Create a project
- [ ] Drag and drop tasks

---

## Next Steps

### For Local Development:
1. Keep the dev server running
2. Make changes to code - hot reload is automatic
3. Browser will update instantly
4. Check console for errors

### For Production Deployment:
See **DEPLOYMENT_GUIDE.md** for complete instructions

**Quick Deploy Options:**

**Vercel (Easiest):**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

**Traditional Hosting:**
```bash
npm run build
# Upload 'dist' folder to your web server
```

---

## Server Status Check

To verify the server is running properly:

```bash
# In another terminal, check if port is in use
lsof -i :5173

# Should show:
# node    PID USER   ... (LISTEN)
```

**Server logs to watch for:**
- `✓ ready in XXXms` - Server started successfully
- Hot module updates show when you save files
- Any errors will be highlighted in red

---

## Common Environment Variables

Add these to your `.env` for full functionality:

```env
# Required for Production
VITE_SSO_PRIMARY_DOMAIN=https://your-domain.com
VITE_COOKIE_DOMAIN=.your-domain.com

# Optional but Recommended
# Get free WalletConnect Project ID: https://cloud.walletconnect.com/
VITE_WALLETCONNECT_PROJECT_ID=abc123...

# For Full Backend Features
# Supabase (https://supabase.com/ - free tier available)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...

# Backend API
VITE_BACKEND_URL=https://api.your-domain.com

# For Blockchain Features
# Free RPC endpoints (or use Infura/Alchemy for better reliability)
VITE_ETHEREUM_RPC_URL=https://eth.llamarpc.com
VITE_POLYGON_RPC_URL=https://polygon-rpc.com
VITE_SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Etherscan (for transaction verification)
VITE_ETHERSCAN_API_KEY=YOUR_API_KEY

# Smart Contracts (after deployment)
VITE_ESCROW_CONTRACT_ADDRESS=0x...
VITE_FIN_TOKEN_ADDRESS=0x...
```

---

## Pro Tips

1. **Use VS Code integrated terminal** - Easier to manage
2. **Keep DevTools open** - Catch errors early
3. **Test with MetaMask** - Install browser extension
4. **Use Sepolia testnet** - For safe testing
5. **Get free test ETH** - https://sepoliafaucet.com/

---

## Need Help?

1. **Check the browser console** (F12) - Most errors show here
2. **Check terminal output** - Server logs show build errors
3. **Review DEPLOYMENT_GUIDE.md** - Comprehensive troubleshooting

**Still stuck?** Check these files:
- `DEPLOYMENT_GUIDE.md` - Full deployment and troubleshooting
- `frontend/package.json` - Available npm scripts
- `frontend/vite.config.ts` - Build configuration

---

## Success!

If you see the FinERP landing page and can click around without errors, you're good to go!

**Next:**
- Explore the UI
- Test wallet connection
- Try creating projects
- Test the Kanban board
- Review DEPLOYMENT_GUIDE.md for production deployment

