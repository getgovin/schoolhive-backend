import express from "express";
import router from "./routes/route.js";

const app = express();
app.use("/uploads", express.static("uploads"));
app.use(express.json());

// Register all routes
app.use("/api/v1", router);

export default app;