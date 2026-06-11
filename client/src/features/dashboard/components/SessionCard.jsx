import {
  MoreHorizontal,
  Clock,
} from "lucide-react";

const SessionCard = ({ project }) => {
  return (
    <div className="w-[28   0px] rounded-3xl border border-zinc-800 bg-[#0B0B10] p-4 text-white shadow-lg transition-all duration-300 hover:border-zinc-700 hover:-translate-y-1">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: project.iconBg }}
        >
          {project.icon}
        </div>

        <button>
          <MoreHorizontal
            size={18}
            className="text-zinc-500 hover:text-white"
          />
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold leading-tight">
          {project.title}
        </h3>

        <p className="mt-2 text-sm font-medium uppercase tracking-wide text-cyan-400">
          {project.tech}
        </p>

        <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
          <Clock size={14} />
          <span>{project.updatedAt}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-3 border-t border-zinc-800" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-3">
          {project.members?.map((member, index) => (
            <img
              key={index}
              src={member}
              alt=""
              className="h-8 w-8 rounded-full border-2 border-[#0B0B10]"
            />
          ))}

          {project.extraMembers > 0 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0B0B10] bg-zinc-800 text-xs">
              +{project.extraMembers}
            </div>
          )}
        </div>

        <button className="text-sm font-medium text-purple-400 transition hover:text-purple-300">
          Open Session
        </button>
      </div>
    </div>
  );
};

export default SessionCard;