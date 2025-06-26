"use client";
import { useState, useCallback } from "react";
import { ExtendedTreeItemProps } from "@/types/FileSystemTypes";
import { useFileTreeStore } from "@/store/useFileTreeStore";
import { findParentId } from "../lib/Treeutils";
interface ContextMenuState {
  x: number;
  y: number;
  clickedItem?: ExtendedTreeItemProps;
}

const useContextMenu = () => {
  const { items: ITEMS } = useFileTreeStore();
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, item?: ExtendedTreeItemProps) => {
      e.preventDefault();
      if (item === undefined) return;
      const parentId = findParentId(ITEMS, item.id);
      setContextMenu({
        x: e.pageX,
        y: e.pageY,
        clickedItem: parentId ? { ...item, parentId } : item,
      });
    },
    []
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return { contextMenu, handleContextMenu, closeContextMenu };
};

export default useContextMenu;
