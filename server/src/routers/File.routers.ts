import { Router } from "express";
import {
  createFile,
  deleteFile,
  getFile,
  renameFile,
  saveFile,
  getTreeByRoomId,
} from "../controllers/File.controllers";
const router = Router();

router.route("/create").post(createFile);
router.route("/delete/:id").delete(deleteFile);
router.route("/get/:id").get(getFile);
router.route("/rename/:id").put(renameFile);
router.route("/save/:id").put(saveFile);
router.route("/tree/:roomId").get(getTreeByRoomId);

export default router;
