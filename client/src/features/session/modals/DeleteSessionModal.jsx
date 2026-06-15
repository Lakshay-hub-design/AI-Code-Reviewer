import Modal from "./Modal";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { deleteSession } from "../sessionSlice";

const DeleteSessionModal = ({ session, onClose }) => {
const dispatch = useDispatch()
const { deleteLoading } = useSelector((state) => state.session)
  const handleDelete = async () => {
  try {
    await dispatch(
      deleteSession(session._id)
    ).unwrap();

    onClose();
  } catch (err) {
    console.error(err);
  }
};

  return (
    <Modal onClose={onClose} title="Delete Session">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20 mb-5">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 flex-shrink-0">
          <Trash2 size={18} />
        </div>
        <div>
          <p className="text-white text-sm font-medium">"{session.title}"</p>
          <p className="text-zinc-400 text-xs mt-0.5">This action cannot be undone.</p>
        </div>
      </div>
      <p className="text-zinc-400 text-sm mb-6">
        Are you sure you want to delete this session? All code and review history will be permanently removed.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300
                     text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteLoading}
          className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700
                     text-white text-sm font-medium transition-colors disabled:opacity-60"
        >
          {deleteLoading ? 'Deleting...' : 'Delete Session'}
        </button>
      </div>
    </Modal>
  )
}

export default DeleteSessionModal