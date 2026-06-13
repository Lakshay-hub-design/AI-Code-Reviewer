import {
  MoreHorizontal,
  Clock,Code2, Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns'

const LANG_CONFIG = {
  javascript: { label: 'JS',  bg: '#1a2a1a', color: '#3497AD', iconBg: '#0D3037' },
  typescript: { label: 'TS',  bg: '#1a1a2e', color: '#60a5fa', iconBg: '#1e3a5f' },
  python:     { label: 'PY',  bg: '#1a1a2e', color: '#a78bfa', iconBg: '#3b1f6e' },
  java:       { label: 'JV',  bg: '#2a1a1a', color: '#fb923c', iconBg: '#7c2d12' },
  cpp:        { label: 'C++', bg: '#1a1a2e', color: '#c084fc', iconBg: '#4c1d95' },
  go:         { label: 'GO',  bg: '#1a2a2a', color: '#22d3ee', iconBg: '#164e63' },
  rust:       { label: 'RS',  bg: '#2a1a1a', color: '#f97316', iconBg: '#7c2d12' },
  html:       { label: 'HT',  bg: '#2a1a1a', color: '#f87171', iconBg: '#7f1d1d' },
  css:        { label: 'CS',  bg: '#1a1a2e', color: '#818cf8', iconBg: '#312e81' },
}
 
// ── Icon for language ─────────────────────────────────────────────────────────
const LangIcon = ({ language }) => {
  const cfg = LANG_CONFIG[language] || LANG_CONFIG.javascript
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
      style={{ background: cfg.iconBg, color: cfg.color }}
    >
      {cfg.label}
    </div>
  )
}

const MemberAvatars = ({ members = [] }) => {
  const visible = members.slice(0, 3)
  const extra   = members.length - visible.length

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {visible.map((m, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full border-2 border-[#111113] overflow-hidden"
            title={m?.username}
          >
            {m?.avatar
              ? <img src={m.avatar} alt={m.username} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-[11px]
                                font-semibold text-white bg-violet-700">
                  {(m?.username || '?')[0].toUpperCase()}
                </div>
            }
          </div>
        ))}
        {extra > 0 && (
          <div className="w-7 h-7 rounded-full border-2 border-[#111113]
                          bg-zinc-700 flex items-center justify-center
                          text-[11px] font-semibold text-zinc-300">
            +{extra}
          </div>
        )}
      </div>
    </div>
  )
}


const SessionCard = ({ project }) => {
  const navigate = useNavigate()

  const language = project.language || 'javascript'
  const cfg      = LANG_CONFIG[language] || LANG_CONFIG.javascript

const rawTime = (project.lastEditedAt || project.updatedAt)
  ? formatDistanceToNow(new Date(project.lastEditedAt || project.updatedAt))
      .replace('about ', '')
      .replace('less than a minute', '1 minute')
  : 'recently'
const timeAgo = `Updated ${rawTime} ago`
  return (
    <div className="w-[28   0px] rounded-3xl border border-zinc-800 bg-[#0B0B10] p-4 text-white shadow-lg transition-all duration-300 hover:border-zinc-700 hover:-translate-y-1">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <LangIcon language={language} />

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

        <span
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: cfg.color }}
        >
          {language}
        </span>

        <p className="flex items-center gap-1.5 mt-2 text-zinc-500 text-xs mb-3">
          <Clock size={11} />
          {timeAgo}
        </p>
      </div>

      {/* Divider */}
      <div className="my-3 border-t border-zinc-800" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-3">
          <MemberAvatars members={project.members}/>
        </div>

        <button
        onClick={() => navigate(`/editor/${project._id}`)} 
        className="text-sm font-medium text-purple-400 transition hover:text-purple-300">
          Open Session
        </button>
      </div>
    </div>
  );
};

export default SessionCard;