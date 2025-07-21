import { Router } from "express";
import { getCode } from "../controllers/connection.controllers";

const router = Router();

router.route("/getCode").get(getCode);
export default router;
