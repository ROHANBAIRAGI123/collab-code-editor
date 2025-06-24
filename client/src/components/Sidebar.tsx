// Sidebar.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FileTree from "./FileTree";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);

  const MIN_WIDTH = 150;
  const MAX_WIDTH = 500;

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Mouse move & up listeners for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return;
      const newWidth =
        e.clientX - sidebarRef.current.getBoundingClientRect().left;

      if (newWidth < MIN_WIDTH) {
        setOpen(false);
        setSidebarWidth(250);
      } else {
        setSidebarWidth(Math.min(Math.max(newWidth, MIN_WIDTH), MAX_WIDTH));
      }
    };

    const handleMouseUp = () => {
      if (isResizing) setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div
      className={`relative flex h-[calc(100vh-90px)] ${
        isResizing ? "cursor-col-resize " : ""
      }`}
    >
      {/* Sidebar Container */}
      <div
        ref={sidebarRef}
        className="relative h-full"
        style={{
          width: `${sidebarWidth}px`,
          minWidth: `${MIN_WIDTH}px`,
          maxWidth: `${MAX_WIDTH}px`,
        }}
      >
        {/* Toggle Button */}
        {!open && (
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
            onClick={() => setOpen(true)}
            className="absolute top-4 left-10 translate-x-[-100%] w-10 h-10 bg-gradient-to-r from-transparent via-gray-900 to-transparent text-white rounded-md flex items-center justify-center shadow-md hover:bg-gray-900 z-30"
          >
            ☰
          </motion.button>
        )}

        {/* Sidebar */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="bg-gradient-to-r from-transparent via-gray-950 to-transparent text-white p-4 h-full shadow-lg z-20 border-r border-gray-700"
              style={{ width: `${sidebarWidth}px` }}
            >
              <button
                onClick={() => setOpen(false)}
                className="mb-4 bg-gray-950 p-2 rounded hover:bg-gray-900 transition-colors"
              >
                ☰
              </button>
              <div className="border-b border-gray-600 pb-2">
                <h2 className="text-lg font-semibold mb-2 pb-2 pt-2 flex items-end border-b border-t border-gray-600">
                  <span className="mr-2">File Tree</span>
                  <span className="flex items-center">
                    <button
                      className="mr-2 p-1 rounded-md hover:bg-gray-800"
                      title="New File"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffffff"
                      >
                        <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6" />
                        <path d="M14 3v5h5M18 21v-6M15 18h6" />
                      </svg>
                    </button>
                    <button
                      className="p-1 rounded-md hover:bg-gray-800"
                      title="New Folder"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffffff"
                      >
                        <path d="M11 21H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h5l2 3h9a2 2 0 0 1 2 2v2M19 15v6M16 18h6" />
                      </svg>
                    </button>
                  </span>
                </h2>
                <FileTree />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resizer Handle */}
        {open && (
          <div
            onMouseDown={() => setIsResizing(true)}
            className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-30"
            style={{ backgroundColor: isResizing ? "#8884" : "transparent" }}
          />
        )}
        {/* {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={closeContextMenu}
          />
        )} */}
      </div>
    </div>
  );
}
