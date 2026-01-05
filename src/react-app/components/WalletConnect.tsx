import { Wallet, LogOut, AlertCircle } from 'lucide-react';
import { useWallet } from '@/react-app/hooks/useWallet';

export default function WalletConnect() {
  const { account, loading, error, connect, disconnect, isConnected, isMobile, openInWalletApp } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const showDeepLink = isMobile && !window.ethereum;

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-red-400 truncate font-bold">{error}</span>
        </div>
        {showDeepLink && (
          <button
            onClick={openInWalletApp}
            className="w-full py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-500/20 transition-all"
          >
            Launch MetaMask App
          </button>
        )}
      </div>
    );
  }

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="px-4 py-2 bg-blue-500/5 border border-blue-500/20 rounded-xl flex-1 sm:flex-initial backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0 shadow-[0_0_8px_rgba(13,153,255,0.8)]" />
            <span className="text-sm font-bold text-white truncate tracking-wide">{formatAddress(account)}</span>
          </div>
        </div>
        <button
          onClick={disconnect}
          className="p-2 hover:bg-blue-500/10 rounded-xl transition-all border border-blue-500/20 flex-shrink-0 text-blue-400 hover:text-blue-300"
          title="Disconnect Wallet"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-auto flex flex-col gap-2">
      <button
        onClick={showDeepLink ? openInWalletApp : connect}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0D99FF] to-[#0066FF] text-white rounded-xl font-bold hover:shadow-[0_8px_25px_rgba(13,153,255,0.4)] hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 text-sm sm:text-base w-full sm:w-auto justify-center"
      >
        <Wallet className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        <span className="truncate">
          {loading ? 'Connecting...' : showDeepLink ? 'Launch MetaMask' : 'Connect Wallet'}
        </span>
      </button>
    </div>
  );
}
