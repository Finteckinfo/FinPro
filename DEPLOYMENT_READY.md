# FinERP Deployment Ready - Netlify + Supabase

## What's Been Set Up

✅ **Netlify Configuration**
- `netlify.toml` created with build settings
- SPA redirects configured
- Security headers added
- Static asset caching configured

✅ **Supabase Integration**
- `@supabase/supabase-js` installed
- `src/services/supabase.ts` created with database helpers
- Database schema SQL provided
- Setup documentation created

✅ **Documentation**
- `NETLIFY_DEPLOYMENT.md` - Complete deployment guide
- `SUPABASE_SETUP.md` - Database setup guide

## Quick Start Deployment

### Step 1: Set Up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project: `finerp-db`
3. Copy your **Project URL** and **anon key** from Settings → API
4. Run the SQL schema from `SUPABASE_SETUP.md` in SQL Editor

### Step 2: Deploy to Netlify (10 minutes)

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - **Base directory**: `frontend` (if deploying from root) or leave empty
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### Step 3: Set Environment Variables in Netlify

Go to **Site settings** → **Environment variables** and add:

#### Required Variables
```
VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_BACKEND_URL=https://[YOUR-PROJECT-REF].supabase.co
VITE_API_URL=https://[YOUR-PROJECT-REF].supabase.co/rest/v1
```

#### Network RPC URLs (get from Alchemy/Infura)
```
VITE_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
```

#### WalletConnect (get from walletconnect.com)
```
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

#### Gelato Relay (optional, for gasless transactions)
```
VITE_GELATO_RELAY_API_KEY=your_gelato_key
VITE_USE_GASLESS_FAUCET=true
```

#### Contract Addresses (after deployment)
```
VITE_FIN_TOKEN_ADDRESS_ETH=
VITE_FIN_TOKEN_ADDRESS_POLYGON=
VITE_FIN_TOKEN_ADDRESS_SEPOLIA=
VITE_ESCROW_CONTRACT_ADDRESS=
VITE_DEX_CONTRACT_ADDRESS=
VITE_FAUCET_CONTRACT_ADDRESS=
```

#### Block Explorer Keys (optional)
```
VITE_ETHERSCAN_API_KEY=your_key
VITE_POLYGONSCAN_API_KEY=your_key
```

#### Domain Configuration
```
VITE_SSO_PRIMARY_DOMAIN=https://your-site.netlify.app
VITE_COOKIE_DOMAIN=.netlify.app
```

### Step 4: Deploy

1. Click "Deploy site"
2. Wait for build (2-5 minutes)
3. Your site will be live at `https://[random-name].netlify.app`

## Testing After Deployment

1. ✅ Visit your Netlify URL
2. ✅ Test wallet connection (MetaMask)
3. ✅ Test project creation (should save to Supabase)
4. ✅ Check Supabase dashboard → Table Editor to see data

## Free Tier Limits

### Netlify
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites
- Free SSL certificates

### Supabase
- 500 MB database
- 2 GB bandwidth/month
- 2 million API requests/month
- 50,000 monthly active users
- 1 GB file storage

## Next Steps

1. Deploy smart contracts to Sepolia testnet
2. Update contract addresses in Netlify env vars
3. Test full workflow: wallet → project → escrow
4. Set up custom domain (optional)
5. Configure monitoring (Sentry, etc.)

## Troubleshooting

**Build fails?**
- Check Netlify build logs
- Ensure all required env vars are set
- Verify Node version (should be 18+)

**Database connection issues?**
- Verify Supabase URL and keys
- Check Supabase project is active
- Review RLS policies if enabled

**Need help?**
- See `NETLIFY_DEPLOYMENT.md` for detailed guide
- See `SUPABASE_SETUP.md` for database setup
- Check Netlify and Supabase documentation

## Files Created

- `frontend/netlify.toml` - Netlify configuration
- `frontend/NETLIFY_DEPLOYMENT.md` - Complete deployment guide
- `frontend/SUPABASE_SETUP.md` - Database setup guide
- `frontend/src/services/supabase.ts` - Supabase client and helpers

You're all set to deploy! 🚀

