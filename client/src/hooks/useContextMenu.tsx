"use client";
import { useState, useCallback } from "react";
import { ExtendedTreeItemProps } from "@/types/FileSystemTypes";
import useItems from "./useItems";
interface ContextMenuState {
  x: number;
  y: number;
  clickedItem?: ExtendedTreeItemProps;
}

const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const { findParentId, items: ITEMS } = useItems();

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
