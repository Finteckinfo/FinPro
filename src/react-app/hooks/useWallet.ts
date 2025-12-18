import { useState, useEffect } from 'react';
import { Contract, formatEther, parseEther } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

import { useWallet as useWalletFromContext } from '@/react-app/context/WalletContext';

export const useWallet = useWalletFromContext;

export function useContract(contractAddress: string, abi: any[]) {
  const { provider, account } = useWallet();
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (provider && account && contractAddress) {
      const signer = provider.getSigner();
      signer.then(s => {
        const contractInstance = new Contract(contractAddress, abi, s);
        setContract(contractInstance);
      });
    } else {
      setContract(null);
    }
  }, [provider, account, contractAddress, abi]);

  return contract;
}

export { formatEther, parseEther };
