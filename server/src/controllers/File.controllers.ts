import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import logger from "../utils/logger";
import { Request, Response } from "express";
import { File } from "../models/File.model";
import buildTree from "../utils/TreeBuilder";

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

  const parentFile = await File.findOne({ id: parentId });
  if (!parentFile) {
    const newParentFile = new File({
      id: parentId,
      parentId: null,
      roomId: roomId,
      label: "src",
      fileType: "folder",
      children: [newFile._id],
    });
    await newParentFile.save();
  }
  if (parentFile) {
    parentFile.children.push(newFile._id);
    await parentFile.save();
  }

  res.status(200).json(new ApiResponse(201, "File created successfully"));
});

const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  logger.info("File deletion request", req, res);
  const { id } = req.params;
  const file = await File.findById(id);
  if (file) {
    const parentId = file.parentId;
    const parent = await File.findById(parentId);
    if (parent) {
      const index = parent.children.indexOf(file._id);
      if (index > -1) {
        parent.children.splice(index, 1);
        await parent.save();
      }
    }
  }
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

const getTreeByRoomId = asyncHandler(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const files = await File.find({ roomId });

  const tree = buildTree(files);
  res.status(200).json(tree);
});

export {
  createFile,
  deleteFile,
  getFile,
  renameFile,
  saveFile,
  getTreeByRoomId,
};
