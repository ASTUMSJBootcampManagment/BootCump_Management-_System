const dotenv = require("dotenv").config();
require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
const express = require("express");
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authroute");
const userRoutes = require("./routes/userRoute");
const announcementRoute = require("./routes/announcementRoute");
const attendanceRoute = require("./routes/attendanceRoute");
const progressRoute = require("./routes/progressRoutes");
const cors = require("cors");
const assignmentRoutes = require("./routes/assignmentRoutes");
// const BatchRoutes = require("./routes/BatchRoute");
// const announcementRoute = require("./routes/announcementRoute");
// const attendanceRoute = require("./routes/attendanceRoute");
// const progressRoute = require("./routes/progressRoutes");
const gradingRoutes = require("./routes/gradingRoutes");
const BatchRoutes = require("./routes/BatchRoute");
dbConnect();
const app = express();
app.use(
  cors({
<<<<<<< HEAD
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],
=======
    origin: "http://localhost:5173",
>>>>>>> 214d84b7c5f769fb4594a0436d655bc9571b2928
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assignments", assignmentRoutes);
// app.use("/api/batches", BatchRoutes);
// app.use("/api/announcement",announcementRoute)
// app.use("/api/attendance",attendanceRoute)
// app.use("/api/progress",progressRoute)
app.use("/api/grading", gradingRoutes);
app.use("/api/batches", BatchRoutes);
app.use("/api/announcement", announcementRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/progress", progressRoute);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
