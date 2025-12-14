# FinERP Deployment Guide

## Quick Start - Local Development

### Prerequisites
- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)

### 1. Install Dependencies

```bash
cd /home/c0bw3b/.cursor/worktrees/FINERP/sbf/frontend
npm ci --legacy-peer-deps
# or if that fails:
npm install --legacy-peer-deps
```

### 2. Environment Setup

Create a `.env` file in the `frontend/` directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API (optional for local dev)
VITE_BACKEND_URL=http://localhost:3000

# Blockchain RPC URLs
VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
VITE_POLYGON_RPC_URL=https://polygon-rpc.com
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# WalletConnect
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Etherscan (for transaction verification)
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key

# SSO Domain
VITE_SSO_PRIMARY_DOMAIN=http://localhost:5173
VITE_COOKIE_DOMAIN=localhost

# Smart Contracts
VITE_ESCROW_CONTRACT_ADDRESS=0x...
VITE_FIN_TOKEN_ADDRESS=0x...
```

### 3. Start Development Server

```bash
cd /home/c0bw3b/.cursor/worktrees/FINERP/sbf/frontend
npm run dev
```

The app will be available at: **http://localhost:5173**

### 4. Build for Production

```bash
cd /home/c0bw3b/.cursor/worktrees/FINERP/sbf/frontend
npm run build
```

This creates a `dist/` folder with optimized static files.

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd /home/c0bw3b/.cursor/worktrees/FINERP/sbf/frontend
   vercel
   ```

4. **Configure Environment Variables:**
   - Go to your Vercel dashboard
   - Navigate to Project Settings → Environment Variables
   - Add all variables from your `.env` file

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

**Vercel Configuration (`vercel.json` already included):**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Build the project:**
   ```bash
   cd /home/c0bw3b/.cursor/worktrees/FINERP/sbf/frontend
   npm run build
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

5. **Configure Environment Variables:**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Add all VITE_ variables

**Netlify Configuration (`_redirects` already in `public/`):**
```
/*    /index.html   200
```

### Option 3: Traditional Web Hosting (cPanel, etc.)

1. **Build the project:**
   ```bash
   cd /home/c0bw3b/.cursor/worktrees/FINERP/sbf/frontend
   npm run build
   ```

2. **Upload `dist/` folder contents:**
   - Use FTP/SFTP (FileZilla, WinSCP)
   - Upload all files from `dist/` to your web root (usually `public_html/` or `www/`)

3. **Configure Environment Variables:**
   - Since this is a static site, you need to inject env vars at build time
   - Create a `.env.production` file before building
   - Or use a deployment script

4. **Server Configuration:**
   
   **Apache (.htaccess):**
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

   **Nginx:**
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

### Option 4: GitHub Pages

1. **Update `package.json` with your repo URL:**
   ```json
   "homepage": "https://yourusername.github.io/finerp"
   ```

2. **Deploy:**
   ```bash
   cd /home/c0bw3b/.cursor/worktrees/FINERP/sbf/frontend
   npm run build
   npm run deploy
   ```

---

## Environment Variables for Production

⚠️ **IMPORTANT:** Update these for production:

```env
# Production Domain
VITE_SSO_PRIMARY_DOMAIN=https://finerp.app
VITE_COOKIE_DOMAIN=.finerp.app

# Production Blockchain (use Mainnet or appropriate network)
VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
VITE_POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/YOUR_KEY

# Production Smart Contracts
VITE_ESCROW_CONTRACT_ADDRESS=0x... # Deployed contract address
VITE_FIN_TOKEN_ADDRESS=0x... # Deployed token address
```

---

## Verification Checklist

After deployment, verify:

- [ ] Website loads at your domain
- [ ] Wallet connection works (MetaMask, WalletConnect)
- [ ] Login/authentication flow works
- [ ] Dashboard displays correctly
- [ ] Project creation works
- [ ] Kanban board drag-and-drop works
- [ ] Task creation and editing works
- [ ] Escrow funding flow works (test with small amounts first!)
- [ ] Payment approval works
- [ ] All images and assets load

---

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Run `npm ci --legacy-peer-deps` to reinstall dependencies

### Issue: Environment variables not working
**Solution:** 
- Ensure all variables start with `VITE_`
- Rebuild the app after changing env vars
- Check your hosting platform's environment variable settings

### Issue: 404 errors on page refresh
**Solution:** Configure URL rewriting (see deployment options above)

### Issue: Wallet connection fails
**Solution:**
- Verify `VITE_WALLETCONNECT_PROJECT_ID` is set
- Check RPC URLs are correct and have API keys
- Test with different wallets (MetaMask, Coinbase)

### Issue: Escrow transactions fail
**Solution:**
- Verify contract addresses are correct
- Ensure you're on the right network (Sepolia for testing, Mainnet for production)
- Check wallet has sufficient gas + tokens

---

## Monitoring and Maintenance

1. **Set up monitoring:**
   - Use Vercel Analytics or Google Analytics
   - Monitor error logs in browser console
   - Set up Sentry for error tracking

2. **Regular updates:**
   - Keep dependencies updated: `npm audit fix`
   - Test on staging before deploying to production
   - Backup contract addresses and configurations

3. **Security:**
   - Never commit `.env` files to git
   - Rotate API keys regularly
   - Use read-only RPC endpoints where possible
   - Audit smart contracts before mainnet deployment

---

## Support

For issues or questions:
- Check the browser console for errors
- Review the deployment logs
- Verify all environment variables are set correctly
- Test wallet connections with different providers

**Smart Contract Security Note:**
Before deploying to mainnet, ensure:
- Contracts are audited
- Test thoroughly on Sepolia testnet
- Use multi-sig wallets for escrow management
- Have emergency pause mechanisms in place

