import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSession } from "../sessionSlice";
import { Check, Copy, Globe, Link2, Lock, Users, X } from "lucide-react";

const publicSteps = [
  "Teammate opens the join link",
  "They preview the session",
  "They click Join Session",
  "They enter the editor instantly",
];

const privateSteps = [
  "Teammate opens the join link",
  "They preview the private session",
  "They click Request Access",
  "You receive a notification",
  "You approve or decline the request",
];

const ShareSessionModal = ({ session: initialSession, onClose }) => {
  const dispatch = useDispatch();
  const { updateLoading } = useSelector((state) => state.session);
  const isPublic = initialSession.isPublic;
  const [copied, setCopied] = useState(false);

  // This is the JOIN link — not the editor link directly
  const joinLink = `${window.location.origin}/join/${initialSession._id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(joinLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggle = async () => {
    try {
      await dispatch(
        updateSession({
          id: initialSession._id,
          payload: {
            isPublic: !isPublic,
          },
        }),
      ).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-[#0F0F11] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Link2 size={14} className="text-violet-400" />
            </div>
            <h3 className="text-white font-semibold">Share Session</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Session title */}
        <p className="text-zinc-400 text-sm mb-5 truncate">
          <span className="text-zinc-600">Session: </span>
          <span className="text-zinc-300 font-medium">
            {initialSession.title}
          </span>
        </p>

        {/* ── Visibility toggle ── */}
        <div
          className="flex items-center justify-between p-4 rounded-xl
                     border transition-colors mb-5 cursor-pointer"
          style={{
            background: isPublic
              ? "rgba(34,197,94,0.05)"
              : "rgba(255,255,255,0.03)",
            borderColor: isPublic ? "rgba(34,197,94,0.2)" : "#27272a",
          }}
          onClick={!updateLoading ? handleToggle : undefined}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors
              ${isPublic ? "bg-green-500/10 text-green-400" : "bg-zinc-800 text-zinc-500"}`}
            >
              {isPublic ? <Globe size={16} /> : <Lock size={16} />}
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                {isPublic ? "Public" : "Private"}
              </p>
              <p className="text-zinc-500 text-xs mt-0.5">
                {isPublic
                  ? "Anyone with the join link can enter"
                  : "Only added members can access"}
              </p>
            </div>
          </div>

          {/* Toggle switch */}
          <button
            disabled={updateLoading}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
              ${isPublic ? "bg-green-500" : "bg-zinc-700"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
              shadow transition-transform duration-200
              ${isPublic ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </div>

        {/* ── Member count ── */}
        <div className="flex items-center gap-2 text-zinc-500 text-xs mb-5">
          <Users size={13} />
          <span>
            {initialSession.members?.length || 1} member
            {(initialSession.members?.length || 1) !== 1 ? "s" : ""} currently
            in this session
          </span>
        </div>

        {/* ── Copy join link ── */}
        <div className="mb-2">
          <label className="text-zinc-500 text-xs mb-2 block">Join link</label>
          <div className="flex gap-2">
            <div
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl
                            px-3 py-2.5 text-zinc-400 text-xs font-mono truncate
                            flex items-center"
            >
              {joinLink}
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs
                font-semibold transition-all whitespace-nowrap flex-shrink-0
                ${
                  copied
                    ? "bg-green-500/15 text-green-400 border border-green-500/25"
                    : "bg-violet-600/20 text-violet-300 border border-violet-500/25 hover:bg-violet-600/30"
                }`}
            >
              {copied ? (
                <>
                  <Check size={13} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Context message */}
        {!isPublic ? (
          <p className="text-amber-500/70 text-xs flex items-center gap-1.5 mt-2">
            <Lock size={11} />
            Anyone with this link can request access from you
          </p>
        ) : (
          <p className="text-green-500/60 text-xs flex items-center gap-1.5 mt-2">
            <Globe size={11} />
            Share this link — anyone can preview and join the session
          </p>
        )}

        {/* How it works */}
        <div className="mt-5 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
          <p className="text-zinc-500 text-xs font-medium mb-2 uppercase tracking-wider">
            How joining works
          </p>
          {(isPublic ? publicSteps : privateSteps).map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-zinc-500 text-xs"
            >
              <span className="text-violet-500 font-bold">{i + 1}.</span>
              {step}
            </div>
          ))}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl border border-zinc-800
                     text-zinc-400 text-sm hover:bg-zinc-900 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ShareSessionModal;