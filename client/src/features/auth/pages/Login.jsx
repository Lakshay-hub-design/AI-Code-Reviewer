import { FaGithub } from "react-icons/fa";
import {
  Users,
  Sparkles,
  MousePointer2,
  Cloud,
  Terminal,
  Lock,
} from "lucide-react";

import "../styles/auth.css";

const CODE_SNIPPET = `async function reviewCode(diff) {
  const ai = new AIReviewer({
    model: 'precise-v2',
    temperature: 0.2
  });
 
  console.log('Scanning for vulnerabilities...');
  const report = await ai.analyze(diff);
 
  if (report.riskScore > 0.8) {
    return rejectPullRequest(analysis.report);
  }
 
  renderCursor(user.x, user.y, user.color);
  broadcastState({ type: 'cursor', payload });
 
  const session = await db.sessions.findOne({
    where: { roomId, userId },
    include: ['snapshots']
  });
 
  socket.on('code:change', async (delta) => {
    await ot.applyDelta(delta);
    broadcast('code:sync', ot.getDocument());
  });
 
  console.log('Scanning for vulnerabilities...');
  const analysis = await ai.analyze(diff);
 
  if (analysis.riskScore > 0.8) {
    return rejectPullRequest(analysis.report);
  }
 
  return {
    approved: true,
    suggestions: analysis.suggestions,
    score: analysis.score
  };
}
 
function syncCollaborators(roomId) {
  const peers = getPeerList(roomId);
  peers.forEach(peer => {
    peer.socket.emit('presence', {
      userId: self.id,
      cursor: self.cursor,
      color: self.color
    });
  });
}
 
async function autoSaveSession(sessionId, document) {
  const snapshot = {
    id: uuid(),
    sessionId,
    content: document.serialize(),
    timestamp: Date.now()
  };
  await storage.snapshots.upsert(snapshot);
  return snapshot;
}
 
class CollabEditor extends EventEmitter {
  constructor(config) {
    super();
    this.ot = new OperationalTransform();
    this.presence = new PresenceManager();
    this.ai = new AIReviewer(config.ai);
  }
 
  async onJoin(user) {
    await this.presence.register(user);
    this.emit('user:joined', user);
    return this.ot.getDocument();
  }
 
  async applyChange(delta, userId) {
    const transformed = this.ot.transform(delta);
    await this.broadcast('doc:update', transformed);
    return this.ot.getDocument();
  }
}
 
async function runSecurityScan(code) {
  const patterns = [
    /eval\s*\(/g,
    /innerHTML\s*=/g,
    /document\.write/g,
  ];
  const findings = [];
  patterns.forEach((p, i) => {
    if (p.test(code)) findings.push({ rule: i, severity: 'high' });
  });
  return findings;
}`;

const features = [
  {
    icon: <Users size={20} />,
    title: "Real-Time Collaboration",
    desc: "Sync state instantly across your distributed team.",
  },
  {
    icon: <Sparkles size={20} />,
    title: "AI Code Review",
    desc: "Automated analysis of logic, security and performance.",
  },
  {
    icon: <MousePointer2 size={20} />,
    title: "Live Cursor Presence",
    desc: "See where colleagues are working in real-time.",
  },
  {
    icon: <Cloud size={20} />,
    title: "Auto Save Sessions",
    desc: "Persistent review sessions synced instantly.",
  },
];

const handleGithubLogin = () => {
  window.location.href =
    "http://localhost:5000/api/auth/github";
};

export default function Login() {
  return (
    <div className="h-screen bg-[#0A0A0A] text-white flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] bg-violet-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-cyan-500/10 blur-[150px] rounded-full" />

        {/* Code Background */}
        <div className="absolute inset-0 opacity-10 p-10 code-scroll">
          <pre className="text-[11px] leading-[1.75]">
            {CODE_SNIPPET}
          </pre>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-20 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-4">
              Collaborative Coding,{" "}
              <span
                className="text-[#D0BCFF]"
              >
                Powered by AI
              </span>
            </h1>

          <p className="mt-6 text-zinc-400 text-base max-w-xl">
            Real-time collaboration and AI-driven code reviews for elite
            engineering teams. Ship faster with precision.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-12">
            {features.map((item, index) => (
              <div
                key={index}
                className="bg-[#201F1F] border border-white/10 rounded-2xl p-5 hover:border-violet-500/40 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-violet-400 mb-4">
                  {item.icon}
                </div>

                <h3 className="font-semibold mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center bg-[#131313] justify-center px-6 relative">
        <div className="glass-card w-full max-w-md p-8 rounded-3xl">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-500 flex items-center justify-center">
              <Terminal />
            </div>

            <h2 className="text-[30px] font-bold mt-5">
              AI Code Reviewer
            </h2>

            <p className="text-zinc-400 mt-2">
              Ready to ship better code?
            </p>
          </div>

          <button 
            onClick={handleGithubLogin}
            className="w-full h-12 mt-8 bg-white text-black rounded-xl flex items-center justify-center gap-3 font-semibold hover:opacity-90 active:scale-99 cursor-pointer transition">
            <FaGithub size={22} />
            Continue with GitHub
          </button>

          <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm mt-4">
            <Lock size={14} />
            Secure authentication powered by GitHub
          </div>

          <div className="border-t border-white/10 mt-8 pt-6 text-center">
            <p className="text-zinc-400">
              New here?{" "}
              <button className="text-violet-400 hover:underline">
                Request access
              </button>
            </p>

            <div className="flex justify-center gap-5 mt-4 text-sm text-zinc-500">
              <button>Privacy</button>
              <button>Terms</button>
              <button>Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}