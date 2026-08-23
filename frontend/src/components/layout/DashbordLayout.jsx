import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const DashboardLayout = ({ role, children }) => {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
<<<<<<< HEAD
      
      <Sidebar role={role} />

      <div className="lg:ml-64">
        
=======
      <Sidebar role={role} />

      <div className="lg:ml-64">
>>>>>>> 214d84b7c5f769fb4594a0436d655bc9571b2928
        <TopNavbar role={role} />

        <main className="p-5 sm:p-6 lg:p-8">
          {children}
        </main>
<<<<<<< HEAD

      </div>

=======
      </div>
>>>>>>> 214d84b7c5f769fb4594a0436d655bc9571b2928
    </div>
  );
};

export default DashboardLayout;