import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import routes from "./appRoutes.js";
import { ApiError } from "./utills/ApiError.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
await connectDB();

// Middleware
app.use(express.json());

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : true;
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use((error, req, res, next) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: error.data,
    });
  }

  return res.status(500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});