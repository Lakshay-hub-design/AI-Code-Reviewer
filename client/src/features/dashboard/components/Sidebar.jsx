import {
  LayoutDashboard,
  Code2,
  Users,
  Settings,
} from "lucide-react";
import { MdOutlineTerminal } from "react-icons/md";

const Sidebar = () => {
  return (
    <aside className="w-[260px] border-r border-[#8a5cf63c] bg-[#0F0F11]">
      <div className="p-6">
        <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-[#A078FF] text-[#360282]">
                <MdOutlineTerminal size={22} />
            </div>
            <h2 className="text-xl font-bold text-[#BCAAE6]">
                AI Reviewer
            </h2>
        </div>
        
      </div>

      <nav className="px-4 mt-8">
        <div className="space-y-2 text-[#9D97A7]">
          <button className="w-full flex items-center gap-3 bg-zinc-900 rounded-xl p-3">
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button className="w-full flex items-center gap-3 p-3 hover:bg-zinc-900 rounded-xl">
            <Code2 size={18} />
            My Sessions
          </button>

          <button className="w-full flex items-center gap-3 p-3 hover:bg-zinc-900 rounded-xl">
            <Users size={18} />
            Shared With Me
          </button>

          <h3 className="text-xs text-[#57545D] my-6 ml-3 font-bold">ACCOUNT</h3>

          <button className="w-full flex items-center gap-3 p-3 hover:bg-zinc-900 rounded-xl">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;