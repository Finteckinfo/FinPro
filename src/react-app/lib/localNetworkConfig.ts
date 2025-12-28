export const LOCAL_NETWORK_CONFIG = {
  chainId: '0x7a69', // 31337 in hex
  chainName: 'Anvil Local',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['http://127.0.0.1:8545'],
  blockExplorerUrls: ['http://127.0.0.1:8545'],
};

export const addLocalNetwork = async () => {
  if (!window.ethereum) return false;

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [LOCAL_NETWORK_CONFIG],
    });
    return true;
  } catch (error) {
    console.error('Failed to add local network:', error);
    return false;
  }
};

export const switchToLocalNetwork = async () => {
  if (!window.ethereum) return false;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: LOCAL_NETWORK_CONFIG.chainId }],
    });
    return true;
  } catch (error: any) {
    // This error indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      return await addLocalNetwork();
    }
    console.error('Failed to switch to local network:', error);
    return false;
  }
};
