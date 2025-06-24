type FileType =
  | "image"
  | "pdf"
  | "doc"
  | "video"
  | "folder"
  | "pinned"
  | "trash";

export type ExtendedTreeItemProps = {
  fileType?: FileType;
  id: string;
  label: string;
  children?: ExtendedTreeItemProps[];
};
