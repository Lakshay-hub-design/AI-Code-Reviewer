import { useState } from "react";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { updateSession } from "../sessionSlice";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "go",
  "rust",
  "html",
  "css",
];

const EditSessionModal = ({ session, onClose }) => {
  const dispatch = useDispatch();
  const { updateLoading } = useSelector((state) => state.session);
  const [title, setTitle] = useState(session.title);
  const [language, setLanguage] = useState(session.language);

  const handleSave = async () => {
    if (!title.trim()) return;
    try {
      await dispatch(
        updateSession({
          id: session._id,
          payload: {
            title: title.trim(),
            language,
          },
        }),
      ).unwrap();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal onClose={onClose} title="Edit Session">
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-zinc-400 text-xs mb-1.5 block">
            Session Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5
                       text-white text-sm focus:outline-none focus:border-violet-500/60
                       transition-colors"
            placeholder="Session title..."
            maxLength={100}
          />
        </div>
        <div>
          <label className="text-zinc-400 text-xs mb-1.5 block">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5
                       text-white text-sm focus:outline-none focus:border-violet-500/60
                       transition-colors appearance-none cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l} className="bg-zinc-900">
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300
                     text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={updateLoading}
          className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700
                     text-white text-sm font-medium transition-colors disabled:opacity-60"
        >
          {updateLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </Modal>
  );
};

export default EditSessionModal;
