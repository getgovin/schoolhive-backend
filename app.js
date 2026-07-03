import express from "express";
import router from "./routes/route.js";
import cors from "cors"

const app = express();
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors()); // Allow all origins

// Register all routes
app.use("/api/v1", router);

export default app;