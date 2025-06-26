"use client";
import { useState } from "react";
import { ExtendedTreeItemProps } from "@/types/FileSystemTypes";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";

const initialItems: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: "source",
    label: "src",
  },
];

function findParentId(
  tree: ExtendedTreeItemProps[],
  targetId: string
): string | null {
  for (const node of tree) {
    if (node.children?.some((child) => child.id === targetId)) {
      return node.id;
    }
    const nested = node.children && findParentId(node.children, targetId);
    if (nested) return nested;
  }
  return null;
}

const useItems = () => {
  const [items, setItems] = useState<ExtendedTreeItemProps[]>(initialItems);

  return { items, setItems, findParentId };
};

export default useItems;
