import { Router } from "express";
import { askAssistant, askSuggestion } from "../controllers/AI.controllers";

const router = Router();

router.route("/ask-ai").post(askAssistant);
router.route("/ask-suggestion").post(askSuggestion);
export default router;
