"use client";

import * as React from "react";
import { animated, useSpring } from "@react-spring/web";
import { styled, alpha } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import FolderRounded from "@mui/icons-material/FolderRounded";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import {
  useTreeItem,
  UseTreeItemParameters,
} from "@mui/x-tree-view/useTreeItem";
import {
  TreeItemCheckbox,
  TreeItemIconContainer,
  TreeItemLabel,
} from "@mui/x-tree-view/TreeItem";
import { TreeItemIcon } from "@mui/x-tree-view/TreeItemIcon";
import { TreeItemProvider } from "@mui/x-tree-view/TreeItemProvider";
import { TreeItemDragAndDropOverlay } from "@mui/x-tree-view/TreeItemDragAndDropOverlay";
import { useTreeItemModel } from "@mui/x-tree-view/hooks";

import useContextMenu from "@/hooks/useContextMenu";
import ContextMenu from "./TreeContextMenu";
import { useFileTreeStore } from "@/store/useFileTreeStore";
import { usePathname } from "next/navigation";

type FileType =
  | "image"
  | "pdf"
  | "doc"
  | "video"
  | "folder"
  | "pinned"
  | "trash";

type ExtendedTreeItemProps = {
  fileType?: FileType;
  id: string;
  label: string;
};

function DotIcon() {
  return (
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: "70%",
        bgcolor: "warning.main",
        display: "inline-block",
        verticalAlign: "middle",
        zIndex: 1,
        mx: 1,
      }}
    />
  );
}
declare module "react" {
  interface CSSProperties {
    "--tree-view-color"?: string;
    "--tree-view-bg-color"?: string;
  }
}

const TreeItemRoot = styled("li")(({ theme }) => ({
  listStyle: "none",
  margin: 0,
  padding: 0,
  outline: 0,
  color: theme.palette.grey[400],
  ...theme.applyStyles("light", {
    color: theme.palette.grey[800],
  }),
}));

const TreeItemContent = styled("div")(({ theme }) => ({
  padding: theme.spacing(0.5),
  paddingRight: theme.spacing(1),
  paddingLeft: `calc(${theme.spacing(
    1
  )} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
  width: "100%",
  boxSizing: "border-box", // prevent width + padding to overflow
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  flexDirection: "row-reverse",
  borderRadius: theme.spacing(0.7),
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  fontWeight: 500,
  "&[data-expanded]:not([data-focused], [data-selected]) .labelIcon": {
    color: theme.palette.primary.dark,
    ...theme.applyStyles("light", {
      color: theme.palette.primary.main,
    }),
    "&::before": {
      content: '""',
      display: "block",
      position: "absolute",
      left: "16px",
      top: "44px",
      height: "calc(100% - 48px)",
      width: "1.5px",
      backgroundColor: theme.palette.grey[700],
      ...theme.applyStyles("light", {
        backgroundColor: theme.palette.grey[300],
      }),
    },
  },
  [`&[data-focused], &[data-selected]`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    ...theme.applyStyles("light", {
      backgroundColor: theme.palette.primary.main,
    }),
  },
  "&:not([data-focused], [data-selected]):hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: "white",
    ...theme.applyStyles("light", {
      color: theme.palette.primary.main,
    }),
  },
}));

const CustomCollapse = styled(Collapse)({
  padding: 0,
});

const AnimatedCollapse = animated(CustomCollapse);

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

const TreeItemLabelText = styled(Typography)({
  color: "whitesmoke",
  fontFamily: "General Sans",
  fontWeight: 500,
});

interface CustomLabelProps {
  children: React.ReactNode;
  icon?: React.ElementType;
  expandable?: boolean;
}

function CustomLabel({
  icon: Icon,
  expandable,
  children,
  ...other
}: CustomLabelProps) {
  return (
    <TreeItemLabel
      {...other}
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {Icon && (
        <Box
          component={Icon}
          className="labelIcon "
          color="inherit"
          sx={{ mr: 1, fontSize: "1.2rem" }}
        />
      )}

      <TreeItemLabelText variant="body2">{children}</TreeItemLabelText>
      {expandable && <DotIcon />}
    </TreeItemLabel>
  );
}

const getIconFromFileType = (fileType: FileType) => {
  switch (fileType) {
    case "image":
      return ImageIcon;
    case "pdf":
      return PictureAsPdfIcon;
    case "doc":
      return ArticleIcon;
    case "video":
      return VideoCameraBackIcon;
    case "folder":
      return FolderRounded;
    case "pinned":
      return FolderOpenIcon;
    case "trash":
      return DeleteIcon;
    default:
      return ArticleIcon;
  }
};

interface CustomTreeItemProps
  extends Omit<UseTreeItemParameters, "rootRef">,
    Omit<React.HTMLAttributes<HTMLLIElement>, "onFocus"> {
  onRightClick?: (e: React.MouseEvent, item?: ExtendedTreeItemProps) => void;
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>
) {
  const { id, itemId, label, disabled, children, ...other } = props;

  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

  const item = useTreeItemModel<ExtendedTreeItemProps>(itemId)!;

  let icon;
  if (status.expandable) {
    icon = FolderRounded;
  } else if (item.fileType) {
    icon = getIconFromFileType(item.fileType);
  }

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps(other)}>
        <TreeItemContent {...getContentProps()}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>
          <TreeItemCheckbox {...getCheckboxProps()} />
          <CustomLabel
            {...getLabelProps({
              icon,
              expandable: status.expandable && status.expanded,
              onContextMenu: (e: React.MouseEvent) => {
                e.preventDefault();
                props.onRightClick?.(e, item);
              },
            })}
          />
          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function FileTree() {
  const { items } = useFileTreeStore();
  const { fetchTree } = useFileTreeStore();
  const roomId = usePathname().split("/")[2];

  React.useEffect(() => {
    fetchTree(roomId);
  }, [roomId]);

  const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu();
  console.log(items);
  return (
    <div>
      <RichTreeView
        items={items}
        // getItemId={getItemId}
        sx={{
          height: "fit-content",
          flexGrow: 1,
          maxWidth: 400,
          overflowY: "auto",
        }}
        slots={{
          item: (props) => (
            <CustomTreeItem {...props} onRightClick={handleContextMenu} />
          ),
        }}
        itemChildrenIndentation={24}
      />
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          clickedItem={contextMenu.clickedItem}
        />
      )}
    </div>
  );
}
