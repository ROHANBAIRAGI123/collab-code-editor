import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import logger from "../utils/logger";
import { Request, Response } from "express";

// Health check for API
const healthCheckController = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info("Health check successful", req, res);
    res.status(200).json(new ApiResponse(201, "Health check successful"));
  }
);

export { healthCheckController };
