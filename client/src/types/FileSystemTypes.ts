type FileType =
  | "image"
  | "pdf"
  | "doc"
  | "video"
  | "folder"
  | "pinned"
  | "trash";

export type ExtendedTreeItemProps = {
  parentId?: string;
  fileType?: FileType;
  id: string;
  label: string;
  children?: ExtendedTreeItemProps[];
};
