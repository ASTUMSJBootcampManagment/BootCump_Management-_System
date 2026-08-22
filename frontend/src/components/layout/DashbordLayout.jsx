import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const DashboardLayout = ({ role, children }) => {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Sidebar role={role} />

      <div className="lg:ml-64">
        <TopNavbar role={role} />

        <main className="p-5 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;