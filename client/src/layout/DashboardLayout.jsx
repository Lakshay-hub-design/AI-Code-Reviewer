import { Outlet } from "react-router-dom";
import Sidebar from "../shared/components/Sidebar"
import Navbar from "../shared/components/Navbar";
import Footer from "../shared/components/Footer";

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