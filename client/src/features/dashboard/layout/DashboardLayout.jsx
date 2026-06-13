import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#09090B] text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;