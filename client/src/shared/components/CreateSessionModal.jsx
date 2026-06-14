import {
  X,
  Plus,
  FolderPlus,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSession } from "../../features/session/sessionSlice";

export const LANGUAGES = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
];



const CreateSessionModal = ({
  isOpen,
  onClose,
}) => {
    const dispatch = useDispatch()
    const { createLoading } = useSelector((state) => state.session)
    const [title, setTitle] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [isPublic, setIsPublic] = useState(false);
    if (!isOpen) return null;
const  handleCreateSession = async () => {
    if (!title.trim()) {
        alert("Session title is required");
        return;
    }

    try {
        await dispatch(createSession({
            title: title.trim(),
            language,
            isPublic
        })).unwrap()

        setTitle("")
        setLanguage("javascript")
        setIsPublic(false)

        onClose()
    } catch (error) {
        console.error(error)
    }
}
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-violet-500/20 bg-[#09090B] shadow-[0_0_40px_rgba(139,92,246,0.12)] p-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Create New Session
            </h2>

            <p className="mt-2 text-zinc-400">
              Start a fresh review cycle with AI analysis.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="mt-10 space-y-8">

          {/* Title */}
          <div>
            <label className="block mb-3 text-xs font-bold tracking-widest text-zinc-400 uppercase">
              Session Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Authentication"
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-5 py-2.5 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500"
            />
          </div>

          {/* Languages */}
          <div>
            <label className="block mb-4 text-xs font-bold tracking-widest text-zinc-400 uppercase">
              Primary Language
            </label>

            <div className="flex flex-wrap gap-3">
                {LANGUAGES.map((lang) => (
                    <button
                    key={lang.value}
                    type="button"
                    onClick={() => setLanguage(lang.value)}
                    className={`
                        px-4 py-2 rounded-full border transition
                        ${
                        language === lang.value
                            ? "bg-violet-500/20 border-violet-500 text-violet-200"
                            : "bg-zinc-900 border-zinc-800 text-zinc-300"
                        }
                    `}
                    >
                    {lang.label}
                    </button>
                ))}
            </div>
          </div>

          {/* Public Session */}
          <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 px-5 py-3">

            <div>
              <h3 className="font-semibold text-white">
                Public Session
              </h3>

              <p className="text-sm text-zinc-400 mt-1">
                Allow others to view and contribute
              </p>
            </div>

            {/* Toggle */}
            <button 
                onClick={() => setIsPublic((prev) => !prev)}
                className={`
      relative h-7 w-14 rounded-full transition-all duration-300
      ${isPublic ? "bg-violet-600" : "bg-zinc-700"}
    `}>
               <span
      className={`
        absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-300
        ${isPublic ? "left-8" : "left-1"}
      `}
    />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-10 flex justify-end gap-5">

          <button
            onClick={onClose}
            className="px-5 py-2.5 text-zinc-400 hover:text-white"
          >
            Cancel
          </button>

          <button 
            onClick={handleCreateSession}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-3 font-medium text-white shadow-lg shadow-violet-500/20 hover:opacity-90">
            <FolderPlus size={18} />
            {createLoading ? 'Creating...' : 'Create Session'}
          </button>

        </div>
      </div>
    </div>
  );
};

export default CreateSessionModal;