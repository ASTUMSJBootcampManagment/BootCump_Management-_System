const dotenv = require("dotenv").config();
require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4",'1.1.1.1']);
const express = require("express");
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authroute");
const userRoutes = require("./routes/userRoute");
const assignmentRoutes = require("./routes/assignmentRoutes");
const BatchRoutes = require("./routes/BatchRoute");
const announcementRoute= require("./routes/announcementRoute")
const attendanceRoute=require("./routes/attendanceRoute")
const progressRoute=require("./routes/progressRoutes")
dbConnect();
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/batches", BatchRoutes);
app.use("/api/announcement",announcementRoute)
app.use("/api/attendance",attendanceRoute)
app.use("/api/progress",progressRoute)
const PORT = process.env.PORT||3000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
