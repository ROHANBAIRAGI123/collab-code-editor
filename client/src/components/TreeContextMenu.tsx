// components/ContextMenu.tsx
import React from "react";
import { ExtendedTreeItemProps } from "@/types/FileSystemTypes";
import { createFile, deleteFile, renameFile } from "../lib/Treeutils";
import { usePathname } from "next/navigation";
type ContextMenuProps = {
  x: number;
  y: number;
  clickedItem?: ExtendedTreeItemProps;
  onClose: () => void;
};

const ContextMenu = ({ x, y, clickedItem, onClose }: ContextMenuProps) => {
  const path = usePathname();
  const roomid = path.split("/")[2];
  if (!clickedItem) return null;
  return (
    <div
      className="absolute bg-gray-800 text-white rounded shadow-md w-40 z-50"
      style={{ top: y, left: x }}
      onMouseLeave={onClose}
    >
      <ul className="py-1">
        <li
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          //:TODO - need to provide new label
          // onClick={() => renameFile(clickedItem.id, clickedItem.label)}
        >
          Rename
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => deleteFile(clickedItem.id)}
        >
          Delete
        </li>
        {clickedItem.fileType !== "doc" && (
          <>
            <li
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() =>
                createFile(
                  roomid,
                  clickedItem.label,
                  "doc",
                  clickedItem.parentId
                )
              }
            >
              New File
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() =>
                createFile(
                  roomid,
                  clickedItem.label,
                  "folder",
                  clickedItem.parentId
                )
              }
            >
              New Folder
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default ContextMenu;
