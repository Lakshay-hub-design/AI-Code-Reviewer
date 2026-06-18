import { Sparkles, Save, Wifi } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import CodeEditor from "./CodeEditor";
import debounce from "lodash.debounce";
import { useDispatch } from "react-redux";
import { updateSessionCode } from "../../session/sessionSlice";
import { connectSocket } from "../../../shared/socket/socket";

const EditorWorkspace = ({ session }) => {
  const dispatch = useDispatch();
  const socket = connectSocket();
  const isRemoteUpdate = useRef(false);
  const [code, setCode] = useState("");
  useEffect(() => {
    if (session?.code) {
      setCode(session.code);
    }
  }, [session]);

  useEffect(() => {
    socket.on("code-change", ({ code }) => {
      isRemoteUpdate.current = true;
      setCode(code);
    });

    return () => {
      socket.off("code-change");
    };
  }, []);

  const saveCode = useMemo(
    () =>
      debounce((value) => {
        dispatch(
          updateSessionCode({
            id: session._id,
            code: value,
          }),
        );
      }, 1000),
    [dispatch, session._id],
  );

  const handleChange = (value) => {
    const newCode = value || "";

    setCode(newCode);

    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    socket.emit("code-change", {
      sessionId: session._id,
      code: newCode,
    });

    saveCode(newCode);
  };

  return (
    <main
      className="
        flex-1
        bg-[#09090B]
        flex
        flex-col
        overflow-hidden
      "
    >
      {/* Toolbar */}
      <div
        className="
          h-12
          border-b
          border-zinc-800
          bg-[#111114]
          px-4
          flex
          items-center
          justify-between
        "
      >
        {/* Left */}
        <div className="flex items-center gap-4">
          <span
            className="
              text-sm
              font-medium
              text-violet-400
              uppercase
            "
          >
            {session?.language}
          </span>

          <span className="text-xs text-zinc-500">Collaborative Session</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            className="
              px-3
              py-1.5
              rounded-lg
              bg-zinc-800
              text-sm
              flex
              items-center
              gap-2
            "
          >
            <Save size={14} />
            Save
          </button>

          <button
            className="
              px-3
              py-1.5
              rounded-lg
              bg-violet-600
              hover:bg-violet-700
              text-sm
              flex
              items-center
              gap-2
            "
          >
            <Sparkles size={14} />
            Review AI
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
          "
        >
          <CodeEditor session={session} code={code} onChange={handleChange} />
        </div>
      </div>

      {/* Status Bar */}
      <div
        className="
          h-8
          border-t
          border-zinc-800
          bg-[#111114]
          px-4
          flex
          items-center
          justify-between
          text-xs
        "
      >
        <div className="flex items-center gap-4">
          <span className="text-zinc-500">Ln 1, Col 1</span>

          <span className="text-zinc-500">{session?.language}</span>
        </div>

        <div className="flex items-center gap-1 text-green-400">
          <Wifi size={12} />
          Connected
        </div>
      </div>
    </main>
  );
};

export default EditorWorkspace;