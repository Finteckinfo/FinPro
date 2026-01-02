import { useState } from 'react';
import { useWallet } from '@/react-app/context/WalletContext';
import { switchToSepoliaNetwork, isOnSepolia } from '@/react-app/lib/sepoliaNetworkConfig';
import { AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';

/**
 * NetworkBanner - Shows a compact, subtle banner when users are on the wrong network
 * Provides one-click switching to Sepolia testnet
 */
export function NetworkBanner() {
    const { chainId, isConnected } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    // Don't show if not connected or already on Sepolia or dismissed
    if (!isConnected || isOnSepolia(chainId) || dismissed) {
        return null;
    }

    const handleSwitchNetwork = async () => {
        setIsLoading(true);

        try {
            const result = await switchToSepoliaNetwork();
            if (result) {
                setSuccess(true);
            }
        } catch {
            // Silently fail - user cancelled or error occurred
        } finally {
            setIsLoading(false);
        }
    };

    const getNetworkName = (id: number | null): string => {
        if (!id) return 'Unknown';
        const networks: Record<number, string> = {
            1: 'Mainnet',
            5: 'Goerli',
            137: 'Polygon',
            80001: 'Mumbai',
            42161: 'Arbitrum',
            10: 'Optimism',
            31337: 'Local',
            11155111: 'Sepolia',
        };
        return networks[id] || `Chain ${id}`;
    };

    return (
        <div className="network-banner">
            <div className="network-banner-content">
                <AlertCircle className="network-banner-icon" />
                <span className="network-banner-text">
                    Wrong network (<strong>{getNetworkName(chainId)}</strong>)
                </span>
                <button
                    onClick={handleSwitchNetwork}
                    disabled={isLoading || success}
                    className="network-banner-btn"
                >
                    {isLoading ? (
                        <Loader2 className="network-banner-spinner" />
                    ) : success ? (
                        <>
                            <CheckCircle className="network-banner-check" />
                            Done
                        </>
                    ) : (
                        'Switch to Sepolia'
                    )}
                </button>
                <button
                    onClick={() => setDismissed(true)}
                    className="network-banner-close"
                    aria-label="Dismiss"
                >
                    <X className="network-banner-x" />
                </button>
            </div>

            <style>{`
        .network-banner {
          position: fixed;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          animation: slideIn 0.25s ease-out;
        }
        
        .network-banner-content {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px 6px 12px;
          background: rgba(251, 191, 36, 0.95);
          backdrop-filter: blur(8px);
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          font-size: 13px;
          color: #78350f;
        }
        
        .network-banner-icon {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
        
        .network-banner-text {
          white-space: nowrap;
        }
        
        .network-banner-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: #78350f;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }
        
        .network-banner-btn:hover:not(:disabled) {
          background: #92400e;
        }
        
        .network-banner-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .network-banner-spinner {
          width: 12px;
          height: 12px;
          animation: spin 1s linear infinite;
        }
        
        .network-banner-check {
          width: 12px;
          height: 12px;
        }
        
        .network-banner-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          padding: 0;
          background: transparent;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          color: #78350f;
          transition: background 0.15s;
        }
        
        .network-banner-close:hover {
          background: rgba(120, 53, 15, 0.1);
        }
        
        .network-banner-x {
          width: 14px;
          height: 14px;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 480px) {
          .network-banner-content {
            font-size: 12px;
            padding: 5px 8px 5px 10px;
          }
          .network-banner-btn {
            padding: 3px 8px;
            font-size: 11px;
          }
        }
      `}</style>
        </div>
    );
}

export default NetworkBanner;
