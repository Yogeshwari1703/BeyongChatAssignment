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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// );
