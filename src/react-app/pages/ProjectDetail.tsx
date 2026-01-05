import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Plus, DollarSign, TrendingUp, CheckCircle, Activity, Sparkles } from 'lucide-react';
import { useProject } from '@/react-app/hooks/useProjects';
import { useSubtasks } from '@/react-app/hooks/useSubtasks';
import { useSubscription } from '@/react-app/context/SubscriptionContext';
import SubtaskCard from '@/react-app/components/SubtaskCard';
import CreateSubtaskModal from '@/react-app/components/CreateSubtaskModal';
import SubscriptionModal from '@/react-app/components/SubscriptionModal';
import WalletConnect from '@/react-app/components/WalletConnect';
import { supabase } from '@/react-app/lib/supabase';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const HASH_SPEC_DATA = [
  { time: '00:00', hashrate: 450, workers: 12 },
  { time: '04:00', hashrate: 520, workers: 14 },
  { time: '08:00', hashrate: 480, workers: 13 },
  { time: '12:00', hashrate: 610, workers: 16 },
  { time: '16:00', hashrate: 590, workers: 15 },
  { time: '20:00', hashrate: 680, workers: 18 },
  { time: '23:59', hashrate: 720, workers: 20 },
];

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading: projectLoading, refetch: refetchProject } = useProject(id || '');
  const { subtasks, loading: subtasksLoading, refetch: refetchSubtasks } = useSubtasks(
    project ? project.id : null
  );
  const { hasFeature } = useSubscription();
  const [isCreateSubtaskModalOpen, setIsCreateSubtaskModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handleStatusChange = async (subtaskId: number, status: string) => {
    try {
      if (status === 'cancelled') {
        const confirmed = window.confirm('Are you sure you want to cancel this stream? This will return the allocated funds to the project treasury.');
        if (!confirmed) return;

        // On-chain cancellation could be triggered here using a contract hook
        // For the MVP, we update the status which will be synced to chain via worker/webhook or manual tx
      }

      const { error } = await supabase
        .from('subtasks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', subtaskId);

      if (error) throw error;

      refetchSubtasks();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleReview = async (subtaskId: number, approved: boolean) => {
    try {
      const status = approved ? 'approved' : 'rejected';

      // Create review entry
      const { error: reviewError } = await supabase
        .from('subtask_reviews')
        .insert({
          subtask_id: subtaskId,
          reviewer_id: 'demo-user', // Should be current user wallet
          status,
          comments: '',
        });

      if (reviewError) throw reviewError;

      // Update subtask status
      const { error: subtaskError } = await supabase
        .from('subtasks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', subtaskId);

      if (subtaskError) throw subtaskError;

      refetchSubtasks();
      refetchProject();
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  const handleSubtaskCreated = () => {
    refetchSubtasks();
    refetchProject();
  };

  if (projectLoading || subtasksLoading) {
    return (
      <div className="min-h-screen bg-[#050B18] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0D99FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-400 font-medium">Synchronizing project data...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#050B18] flex items-center justify-center p-4">
        <div className="bg-[#121A2C] backdrop-blur-xl rounded-[32px] border border-white/5 p-8 max-w-md w-full text-center shadow-2xl">
          <p className="text-gray-400 font-bold text-xl mb-6">Internal Access Error: Project not found</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Overview
          </Link>
        </div>
      </div>
    );
  }

  const availableFunds = project.total_funds - project.allocated_funds;
  const approvedSubtasks = subtasks.filter(s => s.status === 'approved').length;
  const completionRate = subtasks.length > 0 ? (approvedSubtasks / subtasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#050B18]">
      {/* Header */}
      <header className="bg-[#050B18]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              to="/"
              className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all"
            >
              <div className="p-2 bg-white/5 rounded-xl group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-bold uppercase tracking-widest text-xs">Back to Overview</span>
            </Link>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <WalletConnect />
              <button
                onClick={() => setIsCreateSubtaskModalOpen(true)}
                disabled={availableFunds <= 0}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0D99FF] to-[#0066FF] text-white rounded-[18px] font-black hover:shadow-[0_8px_25px_rgba(13,153,255,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 text-sm"
              >
                <Plus className="w-5 h-5" />
                <span>Initialize Component</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Project Profile Section */}
        <div className="bg-[#121A2C] rounded-[40px] border border-white/5 p-8 sm:p-10 mb-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-10 gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                    Project Profile
                  </div>
                  <div className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                  <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                    ID: {project.id.toString().substring(0, 8)}...
                  </div>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
                  {project.name}
                </h1>
                {project.description && (
                  <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">{project.description}</p>
                )}
              </div>
              <span className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border shadow-lg ${project.status === 'active'
                ? 'bg-blue-500/10 text-[#0D99FF] border-blue-500/20'
                : project.status === 'completed'
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-gray-800 text-gray-400 border-gray-700'
                }`}>
                {project.status}
              </span>
            </div>

            {/* Precision Stats Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { icon: DollarSign, label: 'Capitalization', value: `$${project.total_funds.toLocaleString()}`, color: 'blue' },
                { icon: TrendingUp, label: 'Free Resource', value: `$${availableFunds.toLocaleString()}`, color: 'emerald' },
                { icon: CheckCircle, label: 'Component Status', value: `${approvedSubtasks}/${subtasks.length}`, color: 'blue' },
                { icon: Activity, label: 'Velocity Rate', value: `${completionRate.toFixed(0)}%`, color: 'blue' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 rounded-[28px] p-6 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Advanced Analytics (Pro Only) */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="relative p-10 bg-[#121A2C]/60 backdrop-blur-md border border-white/5 rounded-[40px] shadow-2xl overflow-hidden">
                {!hasFeature('analytics') && (
                  <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[4px] rounded-[40px] flex items-center justify-center p-8 border border-white/5">
                    <div className="text-center relative z-10 max-w-sm">
                      <div className="inline-block p-4 bg-blue-500/20 rounded-2xl mb-6 border border-blue-500/20">
                        <Sparkles className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Advanced Analytics</h3>
                      <p className="text-gray-400 text-xs font-bold mb-8 leading-relaxed">Unlock high-fidelity hashrate monitoring, real-time worker stability reports, and predictive growth modeling.</p>
                      <button
                        onClick={() => setIsSubscriptionModalOpen(true)}
                        className="px-10 py-4 bg-blue-500 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 text-xs uppercase tracking-[0.2em]"
                      >
                        Upgrade to Pro
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row gap-10">
                  <div className="flex-1 min-h-[300px]">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl">
                          <Activity className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-white tracking-tight">Computational Velocity</h3>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Hashrate Flux (24H)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Live Stream</span>
                      </div>
                    </div>

                    <div className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={HASH_SPEC_DATA}>
                          <defs>
                            <linearGradient id="colorHash" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                          <XAxis
                            dataKey="time"
                            stroke="#ffffff22"
                            fontSize={10}
                            fontWeight="bold"
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            stroke="#ffffff22"
                            fontSize={10}
                            fontWeight="bold"
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${v}MH`}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#121A2C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                            itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                            labelStyle={{ color: '#ffffff66', fontSize: '9px', marginBottom: '4px', textTransform: 'uppercase' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="hashrate"
                            stroke="#6366f1"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorHash)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="lg:w-80 space-y-6">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Efficiency Rate</span>
                        <span className="text-xs font-black text-indigo-400">94.2%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[94%]" />
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium">Optimal thermal profile maintained across streams.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                        <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">Workers</span>
                        <span className="text-xl font-black text-white">18/20</span>
                      </div>
                      <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                        <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">Uptime</span>
                        <span className="text-xl font-black text-white">99.9%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Development Streams (Subtasks) */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8 px-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Development Streams</h2>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Component Protocol Matrix</p>
            </div>
          </div>

          {subtasks.length === 0 ? (
            <div className="bg-[#121A2C] rounded-[40px] border border-white/5 border-dashed p-16 text-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="inline-block p-8 bg-blue-500/5 rounded-[32px] mb-8 border border-blue-500/10">
                  <Plus className="w-16 h-16 text-blue-500/40 mx-auto" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">
                  No Active Streams
                </h3>
                <p className="text-gray-500 mb-10 max-w-md mx-auto font-medium leading-relaxed">
                  Decompose your project high-level goals into actionable development streams and allocate capital.
                </p>
                <button
                  onClick={() => setIsCreateSubtaskModalOpen(true)}
                  disabled={availableFunds <= 0}
                  className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-[#0D99FF] to-[#0066FF] text-white rounded-[24px] font-black hover:shadow-[0_12px_40px_rgba(13,153,255,0.4)] transition-all disabled:opacity-30"
                >
                  <Plus className="w-5 h-5" />
                  Initialize First Stream
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {subtasks.map((subtask) => (
                <SubtaskCard
                  key={subtask.id}
                  subtask={subtask}
                  onStatusChange={handleStatusChange}
                  onReview={handleReview}
                  isOwner={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CreateSubtaskModal
        isOpen={isCreateSubtaskModalOpen}
        onClose={() => setIsCreateSubtaskModalOpen(false)}
        onSuccess={handleSubtaskCreated}
        projectId={project.id}
        availableFunds={availableFunds}
      />
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </div>
  );
}
