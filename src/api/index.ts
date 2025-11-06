import { Router } from "express";
import healthRoute from "./health";
import v1Routes from "./v1";

const router = Router();


// Health check route
router.use("/health", healthRoute);

// API v1 routes
router.use("/v1", v1Routes);

export default router