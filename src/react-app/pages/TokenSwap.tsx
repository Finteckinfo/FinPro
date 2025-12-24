import { useState } from 'react';
import { ArrowDownUp, Coins, AlertCircle, CheckCircle2, TrendingUp, Clock, ArrowRight, Activity } from 'lucide-react';
import { useTokenBalances, useSwap, getBalance, useSwapHistory } from '../hooks/useTokens';
import { TokenBalance } from '../components/TokenBalance';
import { Navigation } from '../components/Navigation';
import type { TokenType } from '@/shared/types';

export function TokenSwap() {
  const userId = 'demo-user'; // In production, get from auth context
  const { balances, loading, refetch } = useTokenBalances(userId);
  const { swaps, refetch: refetchSwaps } = useSwapHistory(userId);
  const { executeSwap, loading: swapping, error: swapError } = useSwap();

  const [fromToken, setFromToken] = useState<TokenType>('FINe');
  const [toToken, setToToken] = useState<TokenType>('USDT');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const exchangeRate = 1; // 1:1 FINe to USDT
  const receiveAmount = amount ? parseFloat(amount) * exchangeRate : 0;

  const handleSwap = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return;
    }

    if (amountNum > getBalance(balances, fromToken)) {
      return;
    }

    try {
      await executeSwap(fromToken, toToken, amountNum);
      setSuccess(true);
      setAmount('');
      await refetch();
      await refetchSwaps();

      setTimeout(() => setSuccess(false), 3000);
    } catch (_error) {
      // Error is handled by useSwap hook
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B18] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-400 font-medium">Initalizing protocol interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navigation />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3.5 bg-gradient-to-br from-[#0D99FF] to-[#0066FF] rounded-2xl shadow-xl shadow-blue-500/20">
              <ArrowDownUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                Nexus <span className="text-gradient">Swap</span>
              </h1>
              <p className="text-gray-500 font-medium uppercase tracking-widest text-[10px] mt-1">Institutional Liquidity Protocol</p>
            </div>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Execute immediate asset transformations between <span className="text-blue-400 font-bold">FINe</span> and <span className="text-blue-400 font-bold">USDT</span> with zero slippage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Financial Assets */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#121A2C] rounded-[32px] border border-white/5 p-8 shadow-2xl">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                <Coins className="w-4 h-4" />
                Asset Inventory
              </h2>
              <div className="space-y-4">
                <TokenBalance token="FINe" balance={balances.FINe} />
                <TokenBalance token="USDT" balance={balances.USDT} />
              </div>
            </div>

            {/* Protocol Stability Card */}
            <div className="bg-blue-500/5 backdrop-blur-md border border-blue-500/10 rounded-[32px] p-8 relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-black text-white text-sm uppercase tracking-wider">Stability Peg</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  FINe maintains a 1:1 parity with USDT, secured by verified treasury reserves and algorithmic rebalancing.
                </p>
              </div>
            </div>
          </div>

          {/* Middle/Right Column - Swap Terminal */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} className="bg-[#121A2C] rounded-[40px] border border-white/5 p-8 sm:p-10 shadow-2xl relative">
              {/* Source Token */}
              <div className="mb-0">
                <div className="flex justify-between items-end mb-4 px-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Source Asset</label>
                  <span className="text-[10px] font-black text-gray-400">Balance: <span className="text-white">{getBalance(balances, fromToken).toLocaleString()}</span></span>
                </div>
                <div className="bg-black/20 border border-white/5 rounded-[28px] p-6 focus-within:border-blue-500/30 transition-all">
                  <div className="flex justify-between items-center">
                    <select
                      value={fromToken}
                      onChange={(e) => setFromToken(e.target.value as TokenType)}
                      className="bg-[#1C263B] text-xl font-black text-white outline-none cursor-pointer rounded-xl px-4 py-2 border border-white/5"
                    >
                      <option value="FINe">FINe</option>
                      <option value="USDT">USDT</option>
                    </select>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="bg-transparent text-4xl font-black text-white text-right outline-none w-full ml-4 placeholder:text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Interaction Node */}
              <div className="flex justify-center -my-6 relative z-10">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="p-4 bg-white/5 backdrop-blur-3xl rounded-2xl hover:scale-110 transition-all border border-white/10 group shadow-2xl"
                >
                  <ArrowDownUp className="w-6 h-6 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
                </button>
              </div>

              {/* Target Token */}
              <div className="mt-0 mb-10">
                <div className="flex justify-between items-end mb-4 px-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target Asset</label>
                  <span className="text-[10px] font-black text-gray-400">Projection: <span className="text-white">{receiveAmount.toLocaleString()}</span></span>
                </div>
                <div className="bg-black/20 border border-white/5 rounded-[28px] p-6">
                  <div className="flex justify-between items-center">
                    <select
                      value={toToken}
                      onChange={(e) => setToToken(e.target.value as TokenType)}
                      className="bg-[#1C263B] text-xl font-black text-white outline-none cursor-pointer rounded-xl px-4 py-2 border border-white/5"
                    >
                      <option value="USDT">USDT</option>
                      <option value="FINe">FINe</option>
                    </select>
                    <div className="text-4xl font-black text-gray-700 text-right w-full ml-4">
                      {receiveAmount > 0 ? receiveAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }) : "0.00"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Modules */}
              {swapError && (
                <div className="mb-6 p-5 bg-red-500/10 border border-red-500/20 rounded-[24px] flex items-center gap-4 animate-pulse">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <p className="text-red-400 text-sm font-bold uppercase tracking-tight">{swapError}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-5 bg-green-500/10 border border-green-500/20 rounded-[24px] flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <p className="text-green-300 text-sm font-bold">Transaction verification successful. Ledger updated.</p>
                </div>
              )}

              {/* Execution Engine */}
              <button
                type="submit"
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > getBalance(balances, fromToken) || swapping}
                className="w-full group relative flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-[#0D99FF] to-[#0066FF] text-white rounded-[24px] font-black text-xl hover:shadow-[0_12px_45px_rgba(13,153,255,0.4)] hover:scale-[1.01] transition-all active:scale-[0.99] disabled:opacity-20 disabled:scale-100 disabled:shadow-none border border-white/10"
              >
                {swapping ? (
                  <>
                    <Activity className="w-6 h-6 animate-pulse" />
                    <span>Synchronizing Ledger...</span>
                  </>
                ) : (
                  <>
                    <span>Initialize Transaction</span>
                    <ArrowRight className="w-6 h-6 absolute right-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </>
                )}
              </button>

              <p className="text-center mt-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Zero Gas Protocol Fee Applied</p>
            </form>

            {/* Audit History */}
            {swaps.length > 0 && (
              <div className="bg-[#121A2C] rounded-[40px] border border-white/5 p-8 shadow-2xl">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3">
                  <Clock className="w-4 h-4" />
                  Transaction Audit History
                </h2>
                <div className="space-y-3">
                  {swaps.slice(0, 5).map((swap) => (
                    <div key={swap.id} className="p-5 bg-white/5 rounded-[22px] border border-white/5 hover:border-blue-500/20 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                          <ArrowDownUp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-white">
                            {swap.from_amount} {swap.from_token} <ArrowRight className="inline w-3 h-3 mx-1 text-gray-600" /> {swap.to_amount} {swap.to_token}
                          </div>
                          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">
                            TS: {formatDate(swap.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-green-400 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">Verified</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
