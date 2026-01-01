require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const articleRoutes = require("./routes/article.routes");

const app = express(); // app FIRST

// ---------------- CONNECT DB ----------------
connectDB();

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());

// ---------------- ROUTES ----------------
app.use("/api/articles", articleRoutes);

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
