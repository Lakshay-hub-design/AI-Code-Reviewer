import {
  Database,
  Layers3,
  Code2,
  BookOpen,
  Palette,
  Share2,
} from "lucide-react";

const iconMap = {
  backend: {
    icon: Database,
    iconColor: "text-violet-400",
    bg: "#241A35",
  },

  frontend: {
    icon: Layers3,
    iconColor: "text-sky-400",
    bg: "#13202D",
  },

  database: {
    icon: Database,
    iconColor: "text-green-400",
    bg: "#13261D",
  },

  dsa: {
    icon: BookOpen,
    iconColor: "text-yellow-400",
    bg: "#302615",
  },

  design: {
    icon: Palette,
    iconColor: "text-pink-400",
    bg: "#2A1626",
  },
};

export default function SharedSessionCard({ sharedSession }) {
  const config = iconMap[sharedSession.type];

  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#0B0B10] px-4 py-2 transition-all duration-300 hover:border-zinc-700">
      
      {/* Left */}
      <div className="flex items-center gap-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: config.bg }}
        >
          <Icon size={18} className={config.iconColor} />
        </div>

        <div>
          <h3 className="font-semibold text-white">
            {sharedSession.title}
          </h3>

          <p className="text-sm text-zinc-400">
            Owner: {sharedSession.owner}
            <span className="mx-2">•</span>
            Last modified {sharedSession.lastModified}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <img
          src={sharedSession.avatar}
          alt={sharedSession.owner}
          className="h-8 w-8 rounded-full border border-zinc-700"
        />

        <button className="text-zinc-400 hover:text-white">
          <Share2 size={18} />
        </button>

        <button className="rounded-xl bg-zinc-700 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-600">
          Open Session
        </button>
      </div>
    </div>
  );
}