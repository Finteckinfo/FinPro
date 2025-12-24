import { useState } from 'react';
import { Plus, Sparkles, TrendingUp, Briefcase, Wallet } from 'lucide-react';
import { useProjects } from '@/react-app/hooks/useProjects';
import ProjectCard from '@/react-app/components/ProjectCard';
import CreateProjectModal from '@/react-app/components/CreateProjectModal';
import WalletConnect from '@/react-app/components/WalletConnect';
import { Navigation } from '@/react-app/components/Navigation';

export default function HomePage() {
  const { projects, loading, error, refetch } = useProjects();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Calculate dashboard stats
  const totalBalance = projects.reduce((acc, p) => acc + p.total_funds, 0);
  const totalAllocated = projects.reduce((acc, p) => acc + p.allocated_funds, 0);
  const activeProjectsCount = projects.filter(p => p.status === 'active').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B18] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0D99FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050B18] flex items-center justify-center p-4">
        <div className="bg-red-500/10 backdrop-blur-xl rounded-[24px] border border-red-500/20 p-8 max-w-md w-full text-center">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Dashboard Header/Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Main Balance Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#0D99FF] to-[#0066FF] rounded-[32px] p-8 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 opacity-80">
                <Wallet className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">Total Managed Capital</span>
              </div>
              <div className="flex items-end gap-3 mb-8">
                <h1 className="text-5xl font-black">${totalBalance.toLocaleString()}</h1>
                <span className="text-blue-100 mb-2 font-medium">USD</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-md">
                  <TrendingUp className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold">${totalAllocated.toLocaleString()} Allocated</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-black/10 rounded-2xl backdrop-blur-md">
                  <Briefcase className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold">{activeProjectsCount} Active Nodes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-[#121A2C] rounded-[32px] p-8 border border-white/5 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Quick Actions</h2>
              <p className="text-gray-500 text-sm mb-6">Manage your digital assets and team projects efficiently.</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full flex items-center justify-between p-4 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 text-white rounded-xl">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white">New Project</span>
                </div>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </button>
              <WalletConnect />
            </div>
          </div>
        </div>

        {/* Projects Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h2 className="text-2xl font-black text-white">Project Ecosystem</h2>
              <p className="text-gray-500 font-medium">Monitoring {projects.length} development stream(s)</p>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-20 bg-[#121A2C] rounded-[40px] border border-white/5 border-dashed">
              <div className="inline-block p-6 bg-blue-500/10 rounded-3xl mb-6">
                <Sparkles className="w-16 h-16 text-[#0D99FF]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                No Projects Detected
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Connect your workspace and initialize your first project to start tracking team performance and managing treasury with Web3.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0D99FF] to-[#0066FF] text-white rounded-2xl font-bold hover:shadow-[0_8px_30px_rgba(13,153,255,0.4)] transition-all"
              >
                <Plus className="w-5 h-5" />
                Get Started Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
      </main>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
