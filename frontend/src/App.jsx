import Sidebar from "./components/Sidebar/Sidebar"

function App() {
  return (
    <div>
      <Sidebar />
      <main className="ml-[230px] min-h-screen bg-[#f8fafc] p-8">
        <h1 className="text-3xl font-bold text-[#102a56]">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-500">
          Welcome to the ASTUMSJ Bootcamp Management System.
        </p>
      </main>
    </div>
  )
}

export default App