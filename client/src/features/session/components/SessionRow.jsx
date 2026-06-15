import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Share2, Trash2, MoreVertical, Globe, Lock,
  Clock3, Users, Pencil,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { languageConfig } from '../../../shared/utils/languageConfig'
import EditSessionModal from '../modals/EditSessionModal'
import ShareSessionModal from '../modals/ShareSessionModal'
import DeleteSessionModal from '../modals/DeleteSessionModal'

// ── Dropdown Menu ─────────────────────────────────────────────────────────────
const DropdownMenu = ({ onEdit, onClose }) => {
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute right-0 top-9 z-50 w-44 bg-[#1A1A1F] border border-zinc-800
                 rounded-xl shadow-xl overflow-hidden"
    >
      <button
        onClick={() => { onEdit(); onClose() }}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300
                   hover:bg-zinc-800 hover:text-white transition-colors"
      >
        <Pencil size={14} className="text-violet-400" />
        Edit Session
      </button>
    </div>
  )
}

// ── Main SessionRow ───────────────────────────────────────────────────────────
const SessionRow = ({ session: initialSession }) => {
  const navigate  = useNavigate()
  const session = initialSession
  const [showShare,   setShowShare]   = useState(false)
  const [showDelete,  setShowDelete]  = useState(false)
  const [showEdit,    setShowEdit]    = useState(false)
  const [showMenu,    setShowMenu]    = useState(false)

  const config = languageConfig[session.language] || languageConfig.javascript

  return (
    <>
      <div className="bg-[#0F0F11] border border-zinc-800 rounded-2xl px-5 py-2
                      flex items-center justify-between
                      hover:border-violet-500/20 hover:bg-[#131316]
                      hover:shadow-[0_0_20px_rgba(168,85,247,0.08)] transition-all">

        {/* Left — icon + info */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20
                          flex items-center justify-center text-cyan-400 font-bold text-xs">
            {session.language?.slice(0,2).toUpperCase()}
          </div>

          <div>
            <h3 className="text-white font-semibold">{session.title}</h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
              <span className={`uppercase text-xs ${config.color}`}>{session.language}</span>
              <span className="flex items-center gap-1">
                {session.isPublic ? <Globe size={13} /> : <Lock size={13} />}
                {session.isPublic ? 'Public' : 'Private'}
              </span>
              <span className="flex items-center gap-1">
                <Clock3 size={13} />
                {formatDistanceToNow(new Date(session.lastEditedAt), { addSuffix: true })}
              </span>
              <span className="flex items-center gap-1">
                <Users size={13} />
                {session.members.length} Member{session.members.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/editor/${session._id}`)}
            className="px-4 py-1.5 rounded-xl bg-violet-600/20 text-violet-300
                       border border-violet-500/20 hover:bg-violet-600/30
                       text-sm font-medium transition-colors"
          >
            Open Session
          </button>

          {/* Share */}
          <button
            onClick={() => setShowShare(true)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Share"
          >
            <Share2 size={17} />
          </button>

          {/* Delete */}
          <button
            onClick={() => setShowDelete(true)}
            className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 size={17} />
          </button>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(m => !m)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="More options"
            >
              <MoreVertical size={17} />
            </button>
            {showMenu && (
              <DropdownMenu
                onEdit={() => setShowEdit(true)}
                onClose={() => setShowMenu(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showShare  && <ShareSessionModal  session={session} onClose={() => setShowShare(false)}  />}
      {showDelete && <DeleteSessionModal session={session} onClose={() => setShowDelete(false)} />}
      {showEdit   && <EditSessionModal   session={session} onClose={() => setShowEdit(false)} />}
    </>
  )
}

export default SessionRow