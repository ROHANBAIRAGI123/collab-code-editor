import { Router } from "express";

import { healthCheckController } from "../controllers/healthCheck.controllers";
const router = Router();

router.route("/").get(healthCheckController);

export default router;
