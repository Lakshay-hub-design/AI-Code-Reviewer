import { Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { languageConfig } from "../../../shared/utils/languageConfig";

export default function SharedSessionCard({ sharedSession }) {
  const lastModified = formatDistanceToNow(
    new Date(sharedSession.updatedAt),
    { addSuffix: true }
  );
  const config =
  languageConfig[sharedSession.language] ||
  languageConfig.javascript;

  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#0B0B10] px-4 py-2 transition-all duration-300 hover:border-zinc-700">
      
      {/* Left */}
      <div className="flex items-center gap-4">
        <div
          className={`
            flex h-10 w-10 items-center justify-center rounded-full
            ${config.bg}
            border ${config.border}
          `}
        >
          <Icon size={18} className={config.color} />
        </div>

        <div>
          <h3 className="font-semibold text-white">
            {sharedSession.title}
          </h3>

          <p className="text-sm text-zinc-400">
            Owner: {sharedSession.owner.displayName}
            <span className="mx-2">•</span>
            Last modified {lastModified}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <img
          src={sharedSession.owner.avatar}
          alt={sharedSession.owner.displayName}
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