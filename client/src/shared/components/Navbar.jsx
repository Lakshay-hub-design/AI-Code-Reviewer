import {
  Bell,
  Settings,
  Search,
  Plus,
} from "lucide-react";
import { useState } from "react";
import CreateSessionModal from "./CreateSessionModal";

const Navbar = () => {
  const [open, setOpen] = useState(false)
  return (
    <header className="h-18 border-b bg-[#0F0F11] border-zinc-800 flex items-center justify-between px-10">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          type="text"
          placeholder="Search sessions..."
          className="w-[420px] bg-[#1C1B1B] border border-zinc-800 rounded-xl pl-12 pr-4 py-2.5 outline-none"
        />
      </div>

      <div className="flex items-center gap-5">
        <Bell size={20} />
        <Settings size={20} />

        <button 
          onClick={() => setOpen(true)}
          className="bg-violet-600 hover:bg-violet-500 px-5 py-2 rounded-xl flex items-center gap-2">
          <Plus size={18} />
          New Session
        </button>
        <CreateSessionModal 
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      </div>
    </header>
  );
};

export default Navbar;