"use client";
import React, { use, useState } from "react";
import { ExtendedTreeItemProps } from "@/types/FileSystemTypes";
import { createFile, deleteFile, renameFile } from "../lib/Treeutils";
import { usePathname } from "next/navigation";
import { useFileTreeStore } from "@/store/useFileTreeStore";
import { findParentId } from "../lib/Treeutils";
type ContextMenuProps = {
  x: number;
  y: number;
  clickedItem?: ExtendedTreeItemProps;
  onClose: () => void;
};

const ContextMenu = ({ x, y, clickedItem, onClose }: ContextMenuProps) => {
  const path = usePathname();
  const { items, setItems } = useFileTreeStore();
  const roomid = path.split("/")[2];
  const fetchTree = useFileTreeStore((state: any) => state.fetchTree);
  const [mode, setMode] = useState<
    "none" | "rename" | "new-file" | "new-folder"
  >("none");
  const [inputValue, setInputValue] = useState("");

  if (!clickedItem) return null;

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    if (mode === "rename") {
      renameFile(clickedItem.id, inputValue.trim());
      const updatedItem = { ...clickedItem, label: inputValue.trim() };
      const parentId = findParentId(items, clickedItem.id);
      if (parentId) {
        const parent = items.find((item) => item.id === parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          const index = parent.children.findIndex(
            (child) => child.id === clickedItem.id
          );
          if (index > -1) {
            parent.children[index] = updatedItem;
            setItems([...items]);
          }
        }
      }
    } else if (mode === "new-file") {
      createFile(roomid, inputValue.trim(), "doc", clickedItem.id);
      const parentId = findParentId(items, clickedItem.id);
      if (parentId) {
        const parent = items.find((item) => item.id === parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push({
            id: Date.now().toString(),
            parentId: clickedItem.id,
            label: inputValue.trim(),
            fileType: "doc",
          });
          setItems([...items]);
        }
      }
    } else if (mode === "new-folder") {
      createFile(roomid, inputValue.trim(), "folder", clickedItem.id);
      const parentId = findParentId(items, clickedItem.id);
      if (parentId) {
        const parent = items.find((item) => item.id === parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push({
            id: Date.now().toString(),
            parentId: clickedItem.id,
            label: inputValue.trim(),
            fileType: "folder",
          });
          setItems([...items]);
        }
      }
    }

    await fetchTree(roomid);
    onClose();
    setInputValue("");
    setMode("none");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") {
      setMode("none");
      onClose();
    }
  };

  return (
    <div
      className="absolute bg-gray-800 text-white rounded shadow-md w-40 z-50 p-1"
      style={{ top: y, left: x }}
      onMouseLeave={() => {
        setMode("none");
        onClose();
      }}
    >
      {mode === "none" ? (
        <ul className="py-1">
          <li
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              setInputValue(clickedItem.label);
              setMode("rename");
            }}
          >
            Rename
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              deleteFile(clickedItem.id);
              onClose();
            }}
          >
            Delete
          </li>
          {clickedItem.fileType !== "doc" && (
            <>
              <li
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  setMode("new-file");
                  setInputValue("");
                }}
              >
                New File
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  setMode("new-folder");
                  setInputValue("");
                }}
              >
                New Folder
              </li>
            </>
          )}
        </ul>
      ) : (
        <div className="">
          <input
            autoFocus
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKey}
            onBlur={onClose}
            className="w-full bg-gray-900 text-white px-2 py-1 rounded outline-none border border-gray-600"
            placeholder={
              mode === "rename"
                ? "New name"
                : mode === "new-folder"
                ? "Folder name"
                : "File name"
            }
          />
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
