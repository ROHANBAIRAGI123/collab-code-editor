// components/ContextMenu.tsx
import React from "react";
import { ExtendedTreeItemProps } from "@/types/FileSystemTypes";

type ContextMenuProps = {
  x: number;
  y: number;
  clickedItem?: ExtendedTreeItemProps | null;
  onClose: () => void;
};

const ContextMenu = ({ x, y, clickedItem, onClose }: ContextMenuProps) => {
  if (!clickedItem) return null;
  return (
    <div
      className="absolute bg-gray-800 text-white rounded shadow-md w-40 z-50"
      style={{ top: y, left: x }}
      onMouseLeave={onClose}
    >
      <ul className="py-1">
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Rename</li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Delete</li>
        {clickedItem.fileType !== "folder" && (
          <>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
              New File
            </li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
              New Folder
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default ContextMenu;
