# FinERP - Next Steps & Action Items

## Completed Tasks

1. ✅ Removed all SIZLAND/siz.land references from codebase
2. ✅ Created `.env.example` files for contracts and frontend
3. ✅ Updated `env.d.ts` with all required environment variables
4. ✅ Fixed all hardcoded domain references to use environment variables
5. ✅ Updated "Get SIZ on DEX" to "Get FIN on DEX"

## Immediate Next Steps

### 1. Environment Configuration

**Contracts:**
```bash
cd contracts
cp .env.example .env
# Edit .env with your actual values:
# - RPC URLs (Alchemy, Infura, or QuickNode)
# - Private key for deployment
# - Explorer API keys
```

**Frontend:**
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your actual values:
# - RPC URLs
# - WalletConnect Project ID (get from https://cloud.walletconnect.com)
# - Gelato API key (get from https://relay.gelato.network)
# - Contract addresses (after deployment)
```

### 2. Deploy Smart Contracts

**Step 1: Deploy FIN Token**
```bash
cd contracts
npm run deploy:sepolia  # For testnet
# or
npm run deploy:mainnet   # For mainnet
# or
npm run deploy:polygon   # For Polygon
```

After deployment, note the contract addresses and update:
- `contracts/.env` - `FIN_TOKEN_ADDRESS`
- `frontend/.env.local` - `VITE_FIN_TOKEN_ADDRESS_*`

**Step 2: Deploy Test Token Faucet**
```bash
npx hardhat run scripts/deployFaucet.ts --network sepolia
```

Update environment variables with the faucet address.

**Step 3: Deploy Other Contracts**
- ProjectEscrow
- FINSwap (DEX)
- MultiSigWallet

### 3. Configure Frontend

After deploying contracts, update `frontend/.env.local`:
```bash
VITE_FIN_TOKEN_ADDRESS_SEPOLIA=0x...  # From deployment
VITE_FAUCET_CONTRACT_ADDRESS=0x...     # From deployment
VITE_ESCROW_CONTRACT_ADDRESS=0x...     # From deployment
VITE_DEX_CONTRACT_ADDRESS=0x...        # From deployment
```

### 4. Test the System

**Multi-Wallet Connection:**
1. Start frontend: `cd frontend && npm run dev`
2. Test MetaMask connection
3. Test WalletConnect connection
4. Test Coinbase Wallet connection

**Token Faucet:**
1. Connect wallet
2. Navigate to test token faucet component
3. Request test tokens
4. Verify tokens received in wallet

**Token Minting:**
```bash
cd contracts
# Mint to single address
npx hardhat run scripts/mintTestTokens.ts --network sepolia

# Mint to multiple addresses
npx hardhat run scripts/mintBatchTestTokens.ts --network sepolia

# Distribute from admin treasury
npx hardhat run scripts/distributeTestTokens.ts --network sepolia
```

### 5. Verify Contract Deployment

After deployment, verify contracts on block explorers:
```bash
# Sepolia
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>

# Mainnet
npx hardhat verify --network mainnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Required API Keys & Services

1. **RPC Provider** (choose one):
   - Alchemy: https://www.alchemy.com/
   - Infura: https://www.infura.io/
   - QuickNode: https://www.quicknode.com/

2. **WalletConnect**:
   - Project ID: https://cloud.walletconnect.com
   - Add to `VITE_WALLETCONNECT_PROJECT_ID`

3. **Gelato Relay** (for gasless transactions):
   - API Key: https://relay.gelato.network
   - Add to `VITE_GELATO_RELAY_API_KEY`

4. **Block Explorers** (for contract verification):
   - Etherscan API: https://etherscan.io/apis
   - Polygonscan API: https://polygonscan.com/apis

## Testing Checklist

- [ ] Contracts compile without errors
- [ ] Contracts deploy successfully
- [ ] Frontend connects to MetaMask
- [ ] Frontend connects to WalletConnect
- [ ] Frontend connects to Coinbase Wallet
- [ ] Test token faucet works
- [ ] Token minting scripts work
- [ ] Gasless transactions work (if Gelato configured)
- [ ] FIN token balance displays correctly
- [ ] Network switching works
- [ ] All environment variables are set correctly

## Documentation Updates Needed

- [ ] Update README.md with current deployment instructions
- [ ] Document contract addresses after deployment
- [ ] Create deployment guide
- [ ] Document API endpoints (if backend exists)

## Known Issues / Notes

- All siz.land references have been replaced with environment variables
- Cookie domain is now configurable via `VITE_COOKIE_DOMAIN`
- SSO domain is configurable via `VITE_SSO_PRIMARY_DOMAIN`
- Default fallbacks use localhost for development

## Getting Help

- Check `contracts/TOKEN_MINTING_GUIDE.md` for token minting details
- Check `frontend/README.md` for frontend setup
- Review environment variable examples in `.env.example` files

