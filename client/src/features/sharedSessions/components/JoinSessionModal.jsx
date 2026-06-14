import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Link2, Loader2, Globe, Lock, Users, ArrowRight } from 'lucide-react'
import api from '../../../shared/api/axios'

const LANG_COLOR = {
  javascript: '#F59E0B', typescript: '#3B82F6', python: '#10B981',
  java: '#EF4444', cpp: '#8B5CF6', go: '#06B6D4',
  rust: '#F97316', html: '#F43F5E', css: '#6366F1',
}

const JoinSessionModal = ({ onClose }) => {
  const navigate = useNavigate()

  const [input,   setInput]   = useState('')
  const [preview, setPreview] = useState(null)   // session preview data
  const [pStatus, setPStatus] = useState('idle') // idle | loading | found | private | notfound | error
  const [joining, setJoining] = useState(false)

  // ── Extract session ID from full URL or raw ID ─────────────────────────────
  const extractId = (val) => {
    const trimmed = val.trim()
    // Handle full URL: http://localhost:5173/join/abc123 or /editor/abc123
    if (trimmed.includes('/join/'))   return trimmed.split('/join/').pop().split('?')[0]
    if (trimmed.includes('/editor/')) return trimmed.split('/editor/').pop().split('?')[0]
    // Raw ID
    return trimmed
  }

  // ── Preview the session before joining ────────────────────────────────────
  const handlePreview = async () => {
    const id = extractId(input)
    if (!id) return 

    setPStatus('loading')
    setPreview(null)

    try {
      const { data } = await api.get(`/session/preview/${id}`)
      setPreview(data.session)
      setPStatus(data.session.isPublic ? 'found' : 'private')
    } catch (err) {
      setPStatus(err.response?.status === 404 ? 'notfound' : 'error')
    }
  }

  // ── Join and go to editor ──────────────────────────────────────────────────
  const handleJoin = async () => {
    if (!preview) return
    setJoining(true)
    try {
      await api.post(`/session/${preview._id}/join`)
      onClose()
      navigate(`/editor/${preview._id}`)
    } catch (err) {
      setJoining(false)
    }
  }

  const langColor = preview ? (LANG_COLOR[preview.language] || '#7C6FF7') : '#7C6FF7'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-[#0F0F11] border border-zinc-800
                      rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Link2 size={14} className="text-violet-400" />
            </div>
            <h3 className="text-white font-semibold">Join a Session</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">

          {/* ── Input ── */}
          <label className="text-zinc-400 text-xs mb-2 block">
            Session link or ID
          </label>
          <div className="flex gap-2 mb-1">
            <input
              value={input}
              onChange={e => { setInput(e.target.value); setPreview(null); setPStatus('idle') }}
              onKeyDown={e => e.key === 'Enter' && handlePreview()}
              placeholder="Paste link or session ID..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5
                         text-white text-sm placeholder:text-zinc-600
                         focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            <button
              onClick={handlePreview}
              disabled={!input.trim() || pStatus === 'loading'}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm
                         font-medium hover:bg-zinc-700 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
                         flex items-center gap-2"
            >
              {pStatus === 'loading'
                ? <Loader2 size={14} className="animate-spin" />
                : 'Preview'
              }
            </button>
          </div>
          <p className="text-zinc-600 text-xs mb-5">
            Accepts full URLs like <span className="text-zinc-500 font-mono">http://…/join/abc123</span> or just the ID
          </p>

          {/* ── States ── */}

          {/* Not found */}
          {pStatus === 'notfound' && (
            <div className="p-4 rounded-xl bg-red-500/8 border border-red-500/20 text-center mb-4">
              <p className="text-red-400 text-sm font-medium">Session not found</p>
              <p className="text-zinc-500 text-xs mt-1">Check the link and try again</p>
            </div>
          )}

          {/* Private */}
          {pStatus === 'private' && preview && (
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Lock size={16} className="text-zinc-500" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{preview.title}</p>
                  <p className="text-zinc-500 text-xs">Private session</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/8 border border-amber-500/20">
                <p className="text-amber-400/80 text-xs leading-relaxed">
                  This session is private. Ask <span className="font-medium text-amber-400">
                  {preview.owner?.username}</span> to make it public or add you as a member.
                </p>
              </div>
            </div>
          )}

          {/* Found — session preview card */}
          {pStatus === 'found' && preview && (
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-5">
              {/* Top row */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center
                             text-xs font-bold flex-shrink-0"
                  style={{ background: `${langColor}18`, color: langColor }}
                >
                  {preview.language?.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{preview.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs font-medium uppercase" style={{ color: langColor }}>
                      {preview.language}
                    </span>
                    <span className="text-zinc-500 text-xs flex items-center gap-1">
                      <Globe size={11} className="text-green-400" />
                      <span className="text-green-400">Public</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4 text-xs text-zinc-500 py-3
                              border-t border-zinc-800">
                <span className="flex items-center gap-1.5">
                  <Users size={12} />
                  {preview.memberCount} member{preview.memberCount !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  {preview.owner?.avatar
                    ? <img src={preview.owner.avatar} alt="" className="w-4 h-4 rounded-full" />
                    : <div className="w-4 h-4 rounded-full bg-violet-700 flex items-center
                                      justify-center text-[10px] text-white">
                        {preview.owner?.username?.[0]?.toUpperCase()}
                      </div>
                  }
                  by {preview.owner?.displayName || preview.owner?.username}
                </span>
              </div>
            </div>
          )}

          {/* ── Action buttons ── */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-800 text-zinc-400
                         text-sm hover:bg-zinc-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleJoin}
              disabled={pStatus !== 'found' || joining}
              className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700
                         text-white text-sm font-semibold transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {joining
                ? <><Loader2 size={14} className="animate-spin" /> Joining...</>
                : <><ArrowRight size={14} /> Join Session</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JoinSessionModal