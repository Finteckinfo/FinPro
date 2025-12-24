import { Link } from 'react-router';
import { Briefcase, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAssignedProjects } from '@/react-app/hooks/useRoleBasedProjects';
import { useWallet } from '@/react-app/context/WalletContext';
import WalletConnect from '@/react-app/components/WalletConnect';

/**
 * Assignee View - Shows only projects/subtasks assigned to the user
 * Limited to viewing and updating their own tasks
 */
export default function AssigneeView() {
    const { address } = useWallet();
    const { projects, loading } = useAssignedProjects(address);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050B18] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#0D99FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-blue-400 font-medium">Loading your projects...</p>
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
                            <h1 className="text-2xl font-black text-white">My Tasks</h1>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                                Assigned Projects
                            </p>
                        </div>
                        <WalletConnect />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {!address ? (
                    <div className="bg-[#121A2C] rounded-3xl border border-white/5 p-16 text-center">
                        <div className="inline-block p-8 bg-blue-500/5 rounded-2xl mb-6 border border-blue-500/10">
                            <AlertCircle className="w-16 h-16 text-blue-500/40 mx-auto" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3">Connect Your Wallet</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto font-medium">
                            Please connect your wallet to view your assigned tasks and projects.
                        </p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="bg-[#121A2C] rounded-3xl border border-white/5 border-dashed p-16 text-center">
                        <div className="inline-block p-8 bg-blue-500/5 rounded-2xl mb-6 border border-blue-500/10">
                            <Briefcase className="w-16 h-16 text-blue-500/40 mx-auto" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3">No Assigned Tasks</h3>
                        <p className="text-gray-500 max-w-md mx-auto font-medium">
                            You don't have any tasks assigned yet. Check back later or contact your project admin.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-[#121A2C] rounded-3xl border border-white/5 overflow-hidden"
                            >
                                {/* Project Header */}
                                <div className="p-6 border-b border-white/5">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h2 className="text-2xl font-black text-white mb-2">{project.name}</h2>
                                            {project.description && (
                                                <p className="text-gray-400">{project.description}</p>
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
                                </div>

                                {/* Project Stats */}
                                <div className="p-6 bg-white/5">
                                    <Link
                                        to={`/projects/${project.id}`}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0D99FF] to-[#0066FF] text-white rounded-xl font-bold hover:shadow-lg transition-all"
                                    >
                                        View Tasks
                                        <CheckCircle className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Stats */}
                {address && projects.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-[#121A2C] rounded-2xl p-6 border border-white/5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Briefcase className="w-5 h-5 text-blue-400" />
                                </div>
                                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                    Projects
                                </span>
                            </div>
                            <p className="text-3xl font-black text-white">{projects.length}</p>
                        </div>

                        <div className="bg-[#121A2C] rounded-2xl p-6 border border-white/5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-yellow-500/10 rounded-lg">
                                    <Clock className="w-5 h-5 text-yellow-400" />
                                </div>
                                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                    Active
                                </span>
                            </div>
                            <p className="text-3xl font-black text-white">
                                {projects.filter(p => p.status === 'active').length}
                            </p>
                        </div>

                        <div className="bg-[#121A2C] rounded-2xl p-6 border border-white/5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                </div>
                                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                    Completed
                                </span>
                            </div>
                            <p className="text-3xl font-black text-white">
                                {projects.filter(p => p.status === 'completed').length}
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
