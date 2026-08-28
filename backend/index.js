require("dotenv").config();

const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");

const dbConnect = require("./config/dbConnect");

const authRoutes = require("./routes/authroute");

const userRoutes = require("./routes/userRoute");

const batchRoutes = require("./routes/BatchRoute");

const announcementRoute = require("./routes/announcementRoute");

const attendanceRoute = require("./routes/attendanceRoute");

const progressRoute = require("./routes/progressRoutes");

const assignmentRoutes = require("./routes/assignmentRoutes");

const gradingRoutes = require("./routes/gradingRoutes");

const dashboardRoute = require("./routes/dashboardRoute");

const studentRoutes = require("./routes/studentRoutes");

const adminRoute = require("./routes/adminRoute");

const systemRoute = require("./routes/systemRoute");

const resourceRoutes = require("./routes/resourceRoutes");

const notificationRoutes = require("./routes/notificationRoutes");

require("./models/userModel");
require("./models/Batches");
require("./models/Resource");

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
  }),
);

app.use(
  express.json({
    limit: "5mb",
  }),
);
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ASTU MSJ Bootcamp API is running.",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoute);

app.use("/api/system", systemRoute);

app.use("/api/users", userRoutes);

app.use("/api/batches", batchRoutes);

app.use("/api/announcement", announcementRoute);

app.use("/api/attendance", attendanceRoute);

app.use("/api/progress", progressRoute);

app.use("/api/assignments", assignmentRoutes);

app.use("/api/grading", gradingRoutes);

app.use("/api/dashboard", dashboardRoute);

app.use("/api/student", studentRoutes);

app.use("/api/resources", resourceRoutes);

app.use("/api/notifications", notificationRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});

const PORT = process.env.PORT_API || process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
