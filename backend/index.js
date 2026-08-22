const dotenv = require("dotenv").config();
require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
dbConnect();
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assignments", assignmentRoutes);
const PORT = process.env.PORT||3000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
