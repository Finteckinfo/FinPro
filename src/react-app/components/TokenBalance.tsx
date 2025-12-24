import { Coins, Layers } from 'lucide-react';
import type { TokenType } from '@/shared/types';

interface TokenBalanceProps {
  token: TokenType;
  balance: number;
}

const TOKEN_COLORS: Record<TokenType, { from: string; to: string; shadow: string }> = {
  FINe: {
    from: '#0D99FF',
    to: '#0066FF',
    shadow: 'shadow-blue-500/30',
  },
  USDT: {
    from: '#121A2C',
    to: '#050B18',
    shadow: 'shadow-black/20',
  },
};

export function TokenBalance({ token, balance }: TokenBalanceProps) {
  const colors = TOKEN_COLORS[token];
  const isLogoToken = token === 'FINe';

  return (
    <div className={`relative overflow-hidden rounded-[32px] p-8 border border-white/5 ${colors.shadow} shadow-2xl transition-all hover:scale-[1.02] group`}
      style={{
        background: isLogoToken
          ? `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`
          : `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`
      }}>

      {/* Decorative Wave/Pattern */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-white/10 transition-all" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border border-white/10 ${isLogoToken ? 'bg-white/20' : 'bg-blue-500/10 text-blue-400'}`}>
              {isLogoToken ? <Layers className="w-5 h-5 text-white" /> : <Coins className="w-5 h-5" />}
            </div>
            <span className={`text-xs font-black uppercase tracking-[0.2em] ${isLogoToken ? 'text-white' : 'text-gray-500'}`}>
              {token}
            </span>
          </div>
          <div className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${isLogoToken ? 'bg-white/10 border-white/20 text-white' : 'bg-blue-500/5 border-blue-500/10 text-blue-500'}`}>
            {token === 'FINe' ? 'Primary' : 'Stable'}
          </div>
        </div>

        <div className="mt-auto">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Available Liquidity</div>
          <div className={`text-4xl font-black tracking-tighter text-white mb-2`}>
            {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className={`text-xs font-bold ${isLogoToken ? 'text-white/60' : 'text-gray-600'}`}>
            {token === 'FINe' ? 'Platform Governance Asset' : 'USD Tethered Stablecoin'}
          </p>
        </div>
      </div>
    </div>
  );
}
