import { CheckCircle, Clock, XCircle, DollarSign, ArrowRight } from 'lucide-react';
import type { Subtask } from '@/shared/types';

interface SubtaskCardProps {
  subtask: Subtask;
  onStatusChange: (id: number, status: string) => void;
  onReview: (id: number, approved: boolean) => void;
  isOwner: boolean;
}

export default function SubtaskCard({ subtask, onStatusChange, onReview, isOwner }: SubtaskCardProps) {
  const statusConfig = {
    pending: { icon: Clock, label: 'Pending Initialization', bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-white/5' },
    in_progress: { icon: Activity, label: 'Active Development', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    submitted: { icon: Clock, label: 'Audit Required', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    approved: { icon: CheckCircle, label: 'Verified & Released', bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    rejected: { icon: XCircle, label: 'Revision Found', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  };

  const config = statusConfig[subtask.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-[28px] p-6 shadow-xl border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex flex-col lg:flex-row items-start justify-between mb-6 gap-6 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm ${config.bg} ${config.text} ${config.border}`}>
              {config.label}
            </span>
            <div className="w-1 h-1 bg-gray-700 rounded-full" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              ID: {subtask.id}
            </span>
          </div>
          <h3 className="text-xl font-black text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
            {subtask.title}
          </h3>
          {subtask.description && (
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {subtask.description}
            </p>
          )}
          {subtask.assigned_to && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[8px] font-black text-white">
                {subtask.assigned_to.substring(0, 2).toUpperCase()}
              </div>
              <p className="text-xs font-bold text-gray-500">
                Assigned to: <span className="text-blue-400">{subtask.assigned_to}</span>
              </p>
            </div>
          )}
        </div>

        <div className="bg-black/20 rounded-2xl p-4 border border-white/5 flex flex-col items-end justify-center min-w-[140px]">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-blue-400" />
            <span className="text-2xl font-black text-white">
              ${subtask.allocated_amount.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Escrow Allocation</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 relative z-10 pt-4 border-t border-white/5">
        {subtask.status === 'pending' && (
          <button
            onClick={() => onStatusChange(subtask.id, 'in_progress')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl text-sm font-black hover:bg-blue-600 transition-all hover:shadow-[0_8px_20px_rgba(13,153,255,0.3)] group/btn"
          >
            Start Work Stream
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        )}

        {subtask.status === 'in_progress' && (
          <button
            onClick={() => onStatusChange(subtask.id, 'submitted')}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-black rounded-xl text-sm font-black hover:bg-amber-600 transition-all hover:shadow-[0_8px_20px_rgba(245,158,11,0.3)]"
          >
            Submit for Audit
          </button>
        )}

        {subtask.status === 'submitted' && isOwner && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onReview(subtask.id, true)}
              className="flex-1 sm:flex-initial px-8 py-3 bg-green-500 text-black rounded-xl text-sm font-black hover:bg-green-600 transition-all hover:shadow-[0_8px_20px_rgba(34,197,94,0.3)]"
            >
              Verify & Release
            </button>
            <button
              onClick={() => onReview(subtask.id, false)}
              className="flex-1 sm:flex-initial px-8 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-sm font-black hover:bg-red-500 hover:text-white transition-all"
            >
              Reject Audit
            </button>
          </div>
        )}

        {subtask.status === 'rejected' && (
          <button
            onClick={() => onStatusChange(subtask.id, 'in_progress')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl text-sm font-black hover:bg-blue-600 transition-all"
          >
            Revise Stream
          </button>
        )}
      </div>
    </div>
  );
}

// Dummy Activity component for use in statusConfig if not imported
const Activity = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
