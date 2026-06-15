import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Globe, Lock, Users, Code2,
  Loader2, ShieldX, LogIn
} from 'lucide-react'
import { MdOutlineTerminal } from 'react-icons/md'
import api from '../../../shared/api/axios'

// Language colors
const LANG_COLOR = {
  javascript: '#F59E0B', typescript: '#3B82F6', python: '#10B981',
  java: '#EF4444', cpp: '#8B5CF6', go: '#06B6D4',
  rust: '#F97316', html: '#F43F5E', css: '#6366F1',
}

const JoinSession = () => {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const user         = useSelector(s => s.auth.user)

  const [preview,  setPreview]  = useState(null)   // session preview data
  const [status,   setStatus]   = useState('loading') // loading | found | notfound | private
  const [joining,  setJoining]  = useState(false)

  // ── Fetch session preview (no auth required) ───────────────────────────────
  useEffect(() => {
    if (!id) return
    api.get(`/session/preview/${id}`)
      .then(res => {
        setPreview(res.data.session)
        setStatus(res.data.session.isPublic ? 'found' : 'private')
      })
      .catch(err => {
        setStatus(err.response?.status === 404 ? 'notfound' : 'error')
      })
  }, [id])

  // ── Join and redirect to editor ────────────────────────────────────────────
  const handleJoin = async () => {
    if (!user) {
      // Save intended destination, redirect to login
      sessionStorage.setItem('joinRedirect', `/join/${id}`)
      return navigate('/login')
    }

    setJoining(true)
    try {
      await api.post(`/session/${id}/join`)
      navigate(`/editor/${id}`)
    } catch (err) {
      setJoining(false)
    }
  }

  const langColor = preview ? (LANG_COLOR[preview.language] || '#7C6FF7') : '#7C6FF7'

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center p-4">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-[#A078FF] text-[#360282]">
          <MdOutlineTerminal size={18} />
        </div>
        <span className="text-[#BCAAE6] font-bold text-lg">AI Reviewer</span>
      </div>

      {/* ── Loading ── */}
      {status === 'loading' && (
        <div className="flex items-center gap-3 text-zinc-400">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading session...</span>
        </div>
      )}

      {/* ── Not found ── */}
      {status === 'notfound' && (
        <Card>
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
              <ShieldX size={26} className="text-red-400" />
            </div>
            <h2 className="text-white font-bold text-xl mb-2">Session not found</h2>
            <p className="text-zinc-400 text-sm mb-6">
              This session link is invalid or has been deleted.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 rounded-xl bg-zinc-800 text-zinc-300
                         hover:bg-zinc-700 text-sm font-medium transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </Card>
      )}

      {/* ── Private session ── */}
      {status === 'private' && preview && (
        <Card>
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
              <Lock size={24} className="text-zinc-400" />
            </div>
            <h2 className="text-white font-bold text-xl mb-1">{preview.title}</h2>
            <p className="text-zinc-500 text-sm mb-4">This is a private session</p>

            {/* Owner info */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-zinc-400 text-xs">Created by</span>
              {preview.owner?.avatar && (
                <img src={preview.owner.avatar} alt="" className="w-5 h-5 rounded-full" />
              )}
              <span className="text-zinc-300 text-xs font-medium">
                {preview.owner?.displayName || preview.owner?.username}
              </span>
            </div>

            <p className="text-zinc-500 text-sm mb-6">
              Ask the session owner to make it public or add you as a member.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 rounded-xl bg-zinc-800 text-zinc-300
                         hover:bg-zinc-700 text-sm font-medium transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </Card>
      )}

      {/* ── Session found — join card ── */}
      {status === 'found' && preview && (
        <Card>
          {/* Session info */}
          <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center
                         text-sm font-bold flex-shrink-0"
              style={{ background: `${langColor}15`, color: langColor }}
            >
              {preview.language?.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-base truncate">{preview.title}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs uppercase font-medium" style={{ color: langColor }}>
                  {preview.language}
                </span>
                <span className="text-zinc-500 text-xs flex items-center gap-1">
                  <Globe size={11} /> Public
                </span>
                <span className="text-zinc-500 text-xs flex items-center gap-1">
                  <Users size={11} /> {preview.memberCount} member{preview.memberCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Owner */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-zinc-500 text-sm">Session by</span>
            <div className="flex items-center gap-2">
              {preview.owner?.avatar
                ? <img src={preview.owner.avatar} alt="" className="w-6 h-6 rounded-full" />
                : <div className="w-6 h-6 rounded-full bg-violet-700 flex items-center justify-center text-xs text-white">
                    {preview.owner?.username?.[0]?.toUpperCase()}
                  </div>
              }
              <span className="text-zinc-300 text-sm font-medium">
                {preview.owner?.displayName || preview.owner?.username}
              </span>
            </div>
          </div>

          {/* Not logged in warning */}
          {!user && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10
                            border border-amber-500/20 text-amber-400 text-xs mb-5">
              <LogIn size={14} />
              You need to log in with GitHub before joining
            </div>
          )}

          {/* Logged in as */}
          {user && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900
                            border border-zinc-800 mb-5">
              <span className="text-zinc-500 text-xs">Joining as</span>
              {user.avatar && <img src={user.avatar} alt="" className="w-5 h-5 rounded-full" />}
              <span className="text-zinc-300 text-xs font-medium">{user.username}</span>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700
                       text-white font-semibold text-sm transition-colors
                       disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {joining
              ? <><Loader2 size={16} className="animate-spin" /> Joining...</>
              : user
                ? <><Code2 size={16} /> Join Session</>
                : <><LogIn size={16} /> Log in to Join</>
            }
          </button>

          <p className="text-center text-zinc-600 text-xs mt-3">
            You'll be added as a collaborator and can start coding immediately
          </p>
        </Card>
      )}
    </div>
  )
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
const Card = ({ children }) => (
  <div className="w-full max-w-md bg-[#0F0F11] border border-zinc-800
                  rounded-2xl p-6 shadow-2xl">
    {children}
  </div>
)

export default JoinSession