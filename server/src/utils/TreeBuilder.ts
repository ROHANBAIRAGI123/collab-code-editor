import { Types } from "mongoose";

interface FlatFile {
  roomId: string;
  label: string;
  fileType: "doc" | "folder";
  id: string;
  children: Types.ObjectId[];
  parentId?: string | null | undefined;
  FileContent?: string | null | undefined;
}

interface Node {
  itemId: string;
  label: string;
  fileType: string;
  parentId: string | null;
  children: any[];
}

function buildTree(flatFiles: FlatFile[]) {
  const idToNodeMap: { [id: string]: Node } = {};
  const rootNodes = [];

  for (const file of flatFiles) {
    idToNodeMap[file.id] = {
      itemId: file.id,
      label: file.label,
      fileType: file.fileType,
      parentId: file.parentId || null,
      children: [],
    };
  }

  for (const file of flatFiles) {
    if (file.parentId) {
      idToNodeMap[file.parentId]?.children.push(idToNodeMap[file.id]);
    } else {
      rootNodes.push(idToNodeMap[file.id]);
    }
  }

  return rootNodes;
}

export default buildTree;
