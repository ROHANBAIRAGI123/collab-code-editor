import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import logger from "../utils/logger";
import { Request, Response } from "express";
import { File } from "../models/File.model";

// Health check for API
const createFile = asyncHandler(async (req: Request, res: Response) => {
  logger.info("File creation request", req, res);
  const { roomId, label, fileType, parentId } = req.body;
  logger.info(
    `roomId: ${roomId}, label: ${label}, fileType: ${fileType}, parentId: ${parentId}`
  );
  const newFile = new File({
    id: Date.now().toString(),
    parentId: parentId,
    roomId: roomId,
    label: label,
    fileType: fileType,
  });
  await newFile.save();
  res.status(200).json(new ApiResponse(201, "File created successfully"));
});

const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  logger.info("File deletion request", req, res);
  const { id } = req.params;
  await File.findByIdAndDelete(id);
  res.status(200).json(new ApiResponse(201, "File deleted successfully"));
});

const getFile = asyncHandler(async (req: Request, res: Response) => {
  logger.info("File get request", req, res);
  const { id } = req.params;
  const file = await File.findById(id);
  res.status(200).json(file);
});

const renameFile = asyncHandler(async (req: Request, res: Response) => {
  logger.info("File rename request", req, res);
  const { id } = req.params;
  const { label } = req.body;
  await File.findByIdAndUpdate(id, { label });
  res.status(200).json(new ApiResponse(201, "File renamed successfully"));
});

const saveFile = asyncHandler(async (req: Request, res: Response) => {
  logger.info("File save request", req, res);
  const { id } = req.params;
  const { FileContent } = req.body;
  await File.findByIdAndUpdate(id, { FileContent });
  res.status(200).json(new ApiResponse(201, "File saved successfully"));
});

export { createFile, deleteFile, getFile, renameFile, saveFile };
