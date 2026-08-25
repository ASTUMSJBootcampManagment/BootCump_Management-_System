require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
require("./models/userModel");
require("./models/Batches");
const authRoutes = require("./routes/authroute");
const userRoutes = require("./routes/userRoute");
const batchRoutes = require("./routes/BatchRoute");
const announcementRoute = require("./routes/announcementRoute");
const attendanceRoute = require("./routes/attendanceRoute");
const progressRoute = require("./routes/progressRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const gradingRoutes = require("./routes/gradingRoutes");
const dashboardRoute = require("./routes/dashboardRoute");
dbConnect();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/grading", gradingRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/announcement", announcementRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/progress", progressRoute);
app.use("/api/dashboard", dashboardRoute);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});