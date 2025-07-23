import { create } from "zustand";
import { ExtendedTreeItemProps } from "@/types/FileSystemTypes";
import axios from "axios";
import { TreeViewBaseItem } from "@mui/x-tree-view";
import { ensureIds } from "@/lib/Treeutils";

interface FileTreeState {
  items: TreeViewBaseItem<ExtendedTreeItemProps>[];
  setItems: (items: TreeViewBaseItem<ExtendedTreeItemProps>[]) => void;
  fetchTree: (roomId: string) => Promise<void>;
}

export const useFileTreeStore = create<FileTreeState>((set) => ({
  items: [
    {
      id: "123",
      label: "src",
      fileType: "folder",
      children: [],
      parentId: undefined,
    },
  ],

  setItems: (items) => set({ items }),

  fetchTree: async () => {
    const response = await axios.get(
      `${process.env.BACKEND_URL}/api/file/tree/123`
    );
    const tree = ensureIds(response.data);
    set({ items: tree });
  },
}));
