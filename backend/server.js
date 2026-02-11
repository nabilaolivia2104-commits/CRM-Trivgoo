require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const db = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const clientRoute = require("./src/routes/clients.routes");
const salesRoute = require("./src/routes/sales.routes");
const proposalRoute = require("./src/routes/proposal.routes");
const dealsRoute = require("./src/routes/deals.routes");
const path = require("path");
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/upload", express.static(path.join(__dirname, "upload")));

app.get("/", (req, res) => {
  try {
    res.status(200).json({ status: "OK", message: "CRM Backend API running" });
  } catch (error) {
    console.error("Internal Service Error", error);
  }
});
app.use("/api/auth", authRoutes);
app.use("/api/v1", clientRoute);
app.use("/api/v1", salesRoute);
app.use("/api/v1", proposalRoute);
app.use("/api/v1", dealsRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
