import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Plus, DollarSign, TrendingUp, CheckCircle, Activity } from 'lucide-react';
import { useProject } from '@/react-app/hooks/useProjects';
import { useSubtasks } from '@/react-app/hooks/useSubtasks';
import SubtaskCard from '@/react-app/components/SubtaskCard';
import CreateSubtaskModal from '@/react-app/components/CreateSubtaskModal';
import WalletConnect from '@/react-app/components/WalletConnect';
import { supabase } from '@/react-app/lib/supabase';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading: projectLoading, refetch: refetchProject } = useProject(id || '');
  const { subtasks, loading: subtasksLoading, refetch: refetchSubtasks } = useSubtasks(
    project ? project.id : null
  );
  const [isCreateSubtaskModalOpen, setIsCreateSubtaskModalOpen] = useState(false);

  const handleStatusChange = async (subtaskId: number, status: string) => {
    try {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: DollarSign, label: 'Capitalization', value: `$${project.total_funds.toLocaleString()}`, color: 'blue' },
                { icon: TrendingUp, label: 'Free Resource', value: `$${availableFunds.toLocaleString()}`, color: 'emerald' },
                { icon: CheckCircle, label: 'Component Status', value: `${approvedSubtasks}/${subtasks.length}`, color: 'blue' },
                { icon: Activity, label: 'Velocity Rate', value: `${completionRate.toFixed(0)}%`, color: 'blue' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 rounded-[28px] p-6 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 bg-${stat.color}-500/10 rounded-xl text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Development Streams (Subtasks) */}
        <div>
          <div className="flex items-center justify-between mb-8 px-4">
            <div>
              <h2 className="text-2xl font-black text-white">Development Streams</h2>
              <p className="text-gray-500 font-medium">Breakdown of initialized components and assets</p>
            </div>
          </div>

          {subtasks.length === 0 ? (
            <div className="bg-[#121A2C] rounded-[40px] border border-white/5 border-dashed p-16 text-center shadow-inner">
              <div className="inline-block p-8 bg-blue-500/5 rounded-[32px] mb-8 border border-blue-500/10">
                <Plus className="w-16 h-16 text-blue-500/40 mx-auto" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">
                No Active Streams
              </h3>
              <p className="text-gray-500 mb-10 max-w-md mx-auto font-medium">
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

      <CreateSubtaskModal
        isOpen={isCreateSubtaskModalOpen}
        onClose={() => setIsCreateSubtaskModalOpen(false)}
        onSuccess={handleSubtaskCreated}
        projectId={project.id}
        availableFunds={availableFunds}
      />
    </div>
  );
}
