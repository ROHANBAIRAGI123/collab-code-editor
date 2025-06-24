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
        isResizing ? "cursor-col-resize" : ""
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
            className="absolute top-4 left-10 translate-x-[-100%] w-10 h-10 bg-gray-950 text-white rounded-md flex items-center justify-center shadow-md hover:bg-gray-900 z-30"
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
              className="bg-gray-950 text-white p-4 h-full shadow-lg z-20 border-r border-gray-700"
              style={{ width: `${sidebarWidth}px` }}
            >
              <button
                onClick={() => setOpen(false)}
                className="mb-4 bg-gray-950 p-2 rounded hover:bg-gray-900 transition-colors"
              >
                ☰
              </button>
              <div className="">
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
      </div>
    </div>
  );
}
