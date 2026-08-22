function Dashboard() {
  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin User</p>
        </div>
      </div>

      <div className="dashboard-stats">

        <div className="stat-card">
          <p>Total Users</p>
          <h2>0</h2>
        </div>

        <div className="stat-card">
          <p>Total Students</p>
          <h2>0</h2>
        </div>

        <div className="stat-card">
          <p>Total Mentors</p>
          <h2>0</h2>
        </div>

        <div className="stat-card">
          <p>Active Batches</p>
          <h2>0</h2>
        </div>
      </div>
    </div>
  )
}

export default Dashboard