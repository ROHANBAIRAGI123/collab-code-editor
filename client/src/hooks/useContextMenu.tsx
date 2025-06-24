"use client";
import { useState, useCallback } from "react";
import { ExtendedTreeItemProps } from "@/types/FileSystemTypes";

interface ContextMenuState {
  x: number;
  y: number;
  clickedItem?: ExtendedTreeItemProps;
}

const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, item?: ExtendedTreeItemProps) => {
      e.preventDefault();
      setContextMenu({
        x: e.pageX,
        y: e.pageY,
        clickedItem: item,
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
