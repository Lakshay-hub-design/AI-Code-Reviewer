import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer';
import SharedSessionCard from '../components/SharedSessionCard';

import {
  Code2,
  ShoppingBag,
  BookOpen,
  Briefcase,
} from "lucide-react";
import SessionCard from '../components/SessionCard';

const projects = [
  {
    title: "React Interview Prep",
    tech: "React / JS",
    updatedAt: "Updated 2h ago",
    icon: <Code2 size={22} />,
    iconBg: "#0E7490",
    members: [
      "https://i.pravatar.cc/40?img=1",
      "https://i.pravatar.cc/40?img=2",
    ],
    extraMembers: 3,
  },

  {
    title: "E-commerce Backend",
    tech: "Node / Python",
    updatedAt: "Updated 5h ago",
    icon: <ShoppingBag size={22} />,
    iconBg: "#92400E",
    members: [
      "https://i.pravatar.cc/40?img=4",
    ],
    extraMembers: 1,
  },

  {
    title: "DSA Notes",
    tech: "C++ / Java",
    updatedAt: "Updated 1d ago",
    icon: <BookOpen size={22} />,
    iconBg: "#5B21B6",
    members: [
      "https://i.pravatar.cc/40?img=7",
    ],
    extraMembers: 0,
  },

  {
    title: "Portfolio Website",
    tech: "HTML / CSS",
    updatedAt: "Updated 3d ago",
    icon: <Briefcase size={22} />,
    iconBg: "#164E63",
    members: [
      "https://i.pravatar.cc/40?img=9",
      "https://i.pravatar.cc/40?img=10",
    ],
    extraMembers: 0,
  },
];

const sharedSessions = [
  {
    id: "1",
    title: "Backend Team Project",
    owner: "Sarah Chen",
    lastModified: "12h ago",
    avatar: "https://i.pravatar.cc/100?img=5",
    type: "backend",
  },
  {
    id: "2",
    title: "Frontend Refactor",
    owner: "James Wilson",
    lastModified: "2d ago",
    avatar: "https://i.pravatar.cc/100?img=12",
    type: "frontend",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#09090B] text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 px-8 py-6">
          <div>
            <h1 className="text-4xl font-bold mb-3">Your Coding Sessions</h1>

            <p className="text-zinc-400 text-sm">
              Collaborate in real-time with AI-powered insights. Review,
              refactor and ship high-quality code.
            </p>
          </div>

          <section className="mt-7">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Recent Sessions</h2>

              <button className="text-violet-400 hover:text-violet-300">
                View all sessions
              </button>
            </div>

            <div className='grid grid-cols-4 gap-6'>
                {projects.map((project, index) => (
                    <SessionCard key={index} project={project} />
                ))}
            </div>
          </section>

          <section className="mt-5">
            <h2 className="text-2xl font-semibold mb-8">
              Shared With Me
            </h2>

            <div className="space-y-3">
              {sharedSessions.map((session) => (
                <SharedSessionCard 
                    key={session.id}
                    sharedSession={session}
                />
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Dashboard
