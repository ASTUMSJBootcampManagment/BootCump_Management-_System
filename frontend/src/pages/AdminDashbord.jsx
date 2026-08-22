import { FiUsers, FiBook, FiCalendar, FiBarChart2 } from "react-icons/fi";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/dashbord";
import Card from "../components/Card";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      <Sidebar role="admin" />

      <main className="lg:ml-64">

        <Navbar role="admin" />

        <section className="p-5 sm:p-8">

          <div className="mb-7">
            <p className="text-sm font-medium text-green-600">
              Admin Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#14213d] sm:text-3xl">
              Welcome back, Admin!
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Here's what's happening with your bootcamp today.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <Card
              title="Students"
              value="120"
              description="↑ This month"
              icon={FiUsers}
            />

            <Card
              title="Mentors"
              value="10"
              description="Active"
              icon={FiUsers}
              iconBg="bg-green-50"
              iconColor="text-green-600"
            />

            <Card
              title="Batches"
              value="8"
              description="Current"
              icon={FiBook}
              iconBg="bg-purple-50"
              iconColor="text-purple-600"
            />

            <Card
              title="Attendance"
              value="95%"
              description="Excellent"
              icon={FiCalendar}
              iconBg="bg-orange-50"
              iconColor="text-orange-500"
            />

          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#14213d]">
                    Attendance Overview
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Current attendance performance
                  </p>
                </div>

                <FiBarChart2 className="text-xl text-blue-500" />
              </div>

              <div className="mt-8 flex h-52 items-end gap-4 border-b border-l border-gray-200 px-5">
                {[35, 50, 45, 70, 62, 82, 75].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="flex flex-1 items-end justify-center"
                    >
                      <div
                        className="w-full max-w-10 rounded-t-lg bg-[#0b4ea2]"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <h2 className="font-bold text-[#14213d]">
                Recent Activity
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Latest bootcamp activities
              </p>

              <div className="mt-6 space-y-3">

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-[#14213d]">
                    New batch created
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Web Development Batch
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-[#14213d]">
                    New assignment
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    React fundamentals
                  </p>
                </div>

              </div>
            </div>

          </div>

        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
