import { Link } from 'react-router';
import { Briefcase, DollarSign } from 'lucide-react';
import type { Project } from '@/shared/types';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const availableFunds = project.total_funds - project.allocated_funds;
  const percentAllocated = project.total_funds > 0
    ? (project.allocated_funds / project.total_funds) * 100
    : 0;

  return (
    <Link to={`/projects/${project.id}`}>
      <div className="group relative bg-[#121A2C] backdrop-blur-xl rounded-[24px] p-6 shadow-lg shadow-blue-900/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 border border-white/5 hover:border-[#0D99FF]/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D99FF]/5 to-[#0066FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative">
          <div className="flex items-start justify-between mb-6 gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="p-3 bg-gradient-to-br from-[#0D99FF] to-[#0066FF] rounded-2xl shadow-lg shadow-blue-500/20 flex-shrink-0">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-white group-hover:text-[#0D99FF] transition-colors truncate">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${project.status === 'active'
                ? 'bg-blue-500/10 text-[#0D99FF] border-blue-500/20'
                : project.status === 'completed'
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-gray-800 text-gray-400 border-gray-700'
              }`}>
              {project.status.toUpperCase()}
            </span>
          </div>

          {project.description && (
            <p className="text-sm text-gray-400 mb-6 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Budget Status</span>
              </div>
              <span className="font-bold text-white text-lg">
                ${project.total_funds.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider">
                <span className="text-blue-400">Allocated: ${project.allocated_funds.toLocaleString()}</span>
                <span className="text-gray-500">Free: ${availableFunds.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 p-[1px]">
                <div
                  className="h-full bg-gradient-to-r from-[#0D99FF] to-[#0066FF] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(13,153,255,0.5)]"
                  style={{ width: `${percentAllocated}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
