import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express()

// Configure CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

// health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow API is running",
  });
});


app.use(errorHandler);

export default app;


