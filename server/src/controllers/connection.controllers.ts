import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import logger from "../utils/logger";
import { Request, Response } from "express";
import { codeExecution } from "../models/Connection.model";

const getCode = asyncHandler(async (req: Request, res: Response) => {
  logger.info("request recieved for code");
  try {
    const { roomId } = req.query;
    const code = await codeExecution.findOne({ roomId: roomId });
    res.status(200).json(new ApiResponse(201, "code", code));
  } catch (error) {
    console.log("error occurred in controller", error);
  }
});

export { getCode };
