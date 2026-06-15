import { X } from "lucide-react"

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

    {/* Panel */}
    <div className="relative w-full max-w-md bg-[#111113] border border-zinc-800
                    rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold text-base">{title}</h3>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
)

export default Modal