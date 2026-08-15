const dotenv = require("dotenv").config();
require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const dbConnect = require("./config/dbConnect");
const BatchRoutes = require("./routes/BatchRoute");
const authRoutes = require("./routes/authroute");
const userRoutes = require("./routes/userRoute");
dbConnect();
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/batches", BatchRoutes);
const PORT = process.env.PORT||3000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});