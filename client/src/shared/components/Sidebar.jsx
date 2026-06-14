import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Code2, Users, Settings } from 'lucide-react'
import { MdOutlineTerminal } from 'react-icons/md'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',     path: '/dashboard' },
  { icon: Code2,           label: 'My Sessions',   path: '/sessions'  },
  { icon: Users,           label: 'Shared With Me', path: '/shared'   },
]

const ACCOUNT_ITEMS = [
  { icon: Settings, label: 'Settings', path: '/settings' },
]

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="relative flex-shrink-0 border-r border-[#8a5cf63c] bg-[#0F0F11]
                 transition-all duration-300 ease-in-out overflow-hidden"
      style={{ width: expanded ? '280px' : '64px' }}
    >
      {/* ── Logo ── */}
      <div className="p-3 mt-2 flex items-center gap-3 overflow-hidden">
        <div className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center bg-[#A078FF] text-[#360282]">
          <MdOutlineTerminal size={22} />
        </div>
        <h2
          className="text-lg font-bold text-[#BCAAE6] whitespace-nowrap
                     transition-all duration-200"
          style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}
        >
          AI Reviewer
        </h2>
      </div>

      {/* ── Nav ── */}
      <nav className="px-2 mt-8">

        <div className="space-y-1 text-[#9D97A7]">
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 rounded-xl p-3
                         transition-colors duration-150 overflow-hidden
                         ${isActive(path)
                           ? 'bg-zinc-900 text-[#BCAAE6]'
                           : 'hover:bg-zinc-900 hover:text-[#BCAAE6]'
                         }`}
              title={!expanded ? label : undefined}
            >
              {/* Active indicator bar */}
              <div className="relative flex-shrink-0">
                <Icon size={18} />
                {isActive(path) && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2
                                   w-1 h-4 bg-[#A078FF] rounded-r-full" />
                )}
              </div>

              <span
                className="whitespace-nowrap text-sm font-medium
                           transition-all duration-200 text-left"
                style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* ── Account section ── */}
        <div className="mt-6 space-y-1 text-[#9D97A7]">
          <div
            className="overflow-hidden transition-all duration-200"
            style={{ opacity: expanded ? 1 : 0, height: expanded ? 'auto' : 0 }}
          >
            <h3 className="text-xs text-[#57545D] mb-2 ml-3 font-bold tracking-widest">
              ACCOUNT
            </h3>
          </div>

          {ACCOUNT_ITEMS.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 rounded-xl p-3
                         transition-colors duration-150 overflow-hidden
                         ${isActive(path)
                           ? 'bg-zinc-900 text-[#BCAAE6]'
                           : 'hover:bg-zinc-900 hover:text-[#BCAAE6]'
                         }`}
              title={!expanded ? label : undefined}
            >
              <div className="relative flex-shrink-0">
                <Icon size={18} />
                {isActive(path) && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2
                                   w-1 h-4 bg-[#A078FF] rounded-r-full" />
                )}
              </div>

              <span
                className="whitespace-nowrap text-sm font-medium
                           transition-all duration-200"
                style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar