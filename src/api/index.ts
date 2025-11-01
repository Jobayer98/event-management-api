// import {v1Routes} from "./v1";
import {Router} from "express";
import healthRoute from "./health";

const router = Router();

router.use("/health", healthRoute);
// router.use("/v1", v1Routes);

export default router