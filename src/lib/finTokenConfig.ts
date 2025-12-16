// EVM Network configurations for FIN token
export const SUPPORTED_NETWORKS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY',
  },
  polygon: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: import.meta.env.VITE_POLYGON_RPC_URL || 'https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY',
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY',
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: import.meta.env.VITE_ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
  },
  optimism: {
    chainId: 10,
    name: 'Optimism',
    rpcUrl: import.meta.env.VITE_OPTIMISM_RPC_URL || 'https://mainnet.optimism.io',
  },
} as const;

// FIN Token contract addresses (set via environment variables)
export const FIN_TOKEN_ADDRESSES = {
  ethereum: import.meta.env.VITE_FIN_TOKEN_ADDRESS_ETH || '',
  polygon: import.meta.env.VITE_FIN_TOKEN_ADDRESS_POLYGON || '',
  sepolia: import.meta.env.VITE_FIN_TOKEN_ADDRESS_SEPOLIA || '',
  arbitrum: import.meta.env.VITE_FIN_TOKEN_ADDRESS_ARBITRUM || '',
  optimism: import.meta.env.VITE_FIN_TOKEN_ADDRESS_OPTIMISM || '',
};

// Project Escrow contract addresses
export const ESCROW_ADDRESSES = {
  ethereum: import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS_ETH || '',
  polygon: import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS_POLYGON || '',
  sepolia: import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS_SEPOLIA || '',
  arbitrum: import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS_ARBITRUM || '',
  optimism: import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS_OPTIMISM || '',
};

// Function to get escrow address for a chain ID
export function getEscrowAddress(chainId: number): string {
  switch (chainId) {
    case 1:
      return ESCROW_ADDRESSES.ethereum;
    case 137:
      return ESCROW_ADDRESSES.polygon;
    case 11155111:
      return ESCROW_ADDRESSES.sepolia;
    case 42161:
      return ESCROW_ADDRESSES.arbitrum;
    case 10:
      return ESCROW_ADDRESSES.optimism;
    default:
      return '';
  }
}

// Function to get FIN token address for a chain ID
export function getFinTokenAddress(chainId: number): string {
  switch (chainId) {
    case 1:
      return FIN_TOKEN_ADDRESSES.ethereum;
    case 137:
      return FIN_TOKEN_ADDRESSES.polygon;
    case 11155111:
      return FIN_TOKEN_ADDRESSES.sepolia;
    case 42161:
      return FIN_TOKEN_ADDRESSES.arbitrum;
    case 10:
      return FIN_TOKEN_ADDRESSES.optimism;
    default:
      return '';
  }
}

// Alias for backward compatibility
export const getFINTokenAddress = getFinTokenAddress;

// WalletConnect configuration
export const walletConnectConfig = {
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
  chains: [1, 137, 11155111, 42161, 10],
  showQrModal: true,
};
