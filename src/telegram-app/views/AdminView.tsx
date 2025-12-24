import { useState } from 'react';
import { Link } from 'react-router';
import { Plus, Briefcase, DollarSign, Users } from 'lucide-react';
import { useAllProjects } from '@/react-app/hooks/useRoleBasedProjects';
import WalletConnect from '@/react-app/components/WalletConnect';
import CreateProjectModal from '@/react-app/components/CreateProjectModal';

/**
 * Admin View - Shows all projects in the system
 * Allows creating new projects and managing assignments
 */
export default function AdminView() {
    const { projects, loading, refetch } = useAllProjects();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050B18] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#0D99FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-blue-400 font-medium">Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050B18]">
            {/* Header */}
            <header className="bg-[#050B18]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                                All Projects Overview
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <WalletConnect />
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0D99FF] to-[#0066FF] text-white rounded-xl font-bold hover:shadow-lg transition-all text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">New Project</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#121A2C] rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Briefcase className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                Total Projects
                            </span>
                        </div>
                        <p className="text-3xl font-black text-white">{projects.length}</p>
                    </div>

                    <div className="bg-[#121A2C] rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <DollarSign className="w-5 h-5 text-green-400" />
                            </div>
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                Total Funds
                            </span>
                        </div>
                        <p className="text-3xl font-black text-white">
                            ${projects.reduce((sum, p) => sum + p.total_funds, 0).toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-[#121A2C] rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                Active Projects
                            </span>
                        </div>
                        <p className="text-3xl font-black text-white">
                            {projects.filter(p => p.status === 'active').length}
                        </p>
                    </div>
                </div>

                {/* Projects Grid */}
                {projects.length === 0 ? (
                    <div className="bg-[#121A2C] rounded-3xl border border-white/5 border-dashed p-16 text-center">
                        <div className="inline-block p-8 bg-blue-500/5 rounded-2xl mb-6 border border-blue-500/10">
                            <Briefcase className="w-16 h-16 text-blue-500/40 mx-auto" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3">No Projects Yet</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto font-medium">
                            Create your first project to get started with decentralized project management.
                        </p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0D99FF] to-[#0066FF] text-white rounded-2xl font-black hover:shadow-lg transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Create First Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                to={`/projects/${project.id}`}
                                className="bg-[#121A2C] rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">
                                            {project.name}
                                        </h3>
                                        {project.description && (
                                            <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                                        )}
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${project.status === 'active'
                                                ? 'bg-blue-500/10 text-blue-400'
                                                : project.status === 'completed'
                                                    ? 'bg-green-500/10 text-green-400'
                                                    : 'bg-gray-800 text-gray-400'
                                            }`}
                                    >
                                        {project.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">
                                            Total Funds
                                        </p>
                                        <p className="text-lg font-black text-white">
                                            ${project.total_funds.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">
                                            Allocated
                                        </p>
                                        <p className="text-lg font-black text-blue-400">
                                            ${project.allocated_funds.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Project Modal */}
            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    refetch();
                    setIsCreateModalOpen(false);
                }}
            />
        </div>
    );
}
