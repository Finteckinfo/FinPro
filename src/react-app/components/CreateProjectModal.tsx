import { useState } from 'react';
import { X, Sparkles, DollarSign, ArrowRight } from 'lucide-react';
import type { CreateProjectRequest } from '@/shared/types';
import { supabase } from '@/react-app/lib/supabase';
import { useWallet } from '@/react-app/hooks/useWallet';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const { account } = useWallet();
  const [formData, setFormData] = useState<CreateProjectRequest>({
    name: '',
    description: '',
    total_funds: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('projects')
        .insert({
          ...formData,
          owner_id: account?.toLowerCase() || 'demo-user',
          status: 'active'
        });

      if (insertError) throw insertError;

      setFormData({ name: '', description: '', total_funds: 0 });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#121A2C] border border-white/10 rounded-[40px] shadow-2xl shadow-black/50 max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

        <div className="p-8 sm:p-10 border-b border-white/5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-500/10 rounded-xl">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Register Project</h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol Enrollment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors border border-white/5 flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8 overflow-y-auto relative z-10">
          {error && (
            <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-[24px] text-red-400 text-sm font-bold flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              {error}
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">
              Entity Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-[22px] focus:border-blue-500/30 outline-none transition-all text-white placeholder-gray-700 text-lg font-bold"
              placeholder="e.g. Decentralized Treasury Alpha"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">
              Strategic Brief
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-[22px] focus:border-blue-500/30 outline-none transition-all resize-none text-white placeholder-gray-700 font-medium"
              placeholder="Primary objectives and scope of the managed asset..."
            />
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">
              Capital Reserve (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
              <input
                type="number"
                required
                min="0"
                step="1"
                value={formData.total_funds || ''}
                onChange={(e) => setFormData({ ...formData, total_funds: parseFloat(e.target.value) || 0 })}
                className="w-full pl-14 pr-6 py-4 bg-black/20 border border-white/5 rounded-[22px] focus:border-blue-500/30 outline-none transition-all text-white placeholder-gray-700 text-3xl font-black"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="group relative flex-[2] flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-[#0D99FF] to-[#0066FF] text-white rounded-[24px] font-black text-lg hover:shadow-[0_12px_40px_rgba(13,153,255,0.4)] hover:scale-[1.02] transition-all disabled:opacity-20 border border-white/10"
            >
              <span>{loading ? 'Initializing...' : 'Initialize Registry'}</span>
              <ArrowRight className="w-5 h-5 absolute right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
