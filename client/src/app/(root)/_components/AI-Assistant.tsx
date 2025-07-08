// AI.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AI() {
  const [open, setOpen] = useState(false); // Initially closed
  const [sidebarWidth, setSidebarWidth] = useState(350); // Adjusted initial width for better AI assistant look
  const [isResizing, setIsResizing] = useState(false);

  const MIN_WIDTH = 250;
  const MAX_WIDTH = 600;

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Mouse move & up listeners for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return;
      // Calculate new width based on mouse position relative to the right edge of the screen
      const newWidth = window.innerWidth - e.clientX;

      if (newWidth < MIN_WIDTH) {
        setOpen(false);
        setSidebarWidth(350); // Reset width when closed
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
      className={`fixed bottom-0 right-0 h-[calc(100vh)] flex justify-end items-end pr-4 pb-4 z-50 ${
        isResizing ? "cursor-col-resize " : ""
      }`}
    >
      {/* Toggle Button for AI Assistant */}
      {!open && (
        <motion.button
          initial={{ x: 100, opacity: 0 }} // Starts off-screen to the right
          animate={{ x: 0, opacity: 1 }} // Slides in from the right
          exit={{ x: 100, opacity: 0 }} // Slides out to the right
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
          aria-label="Open AI Assistant"
        >
          Icon
        </motion.button>
      )}

      {/* Sidebar Container */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: sidebarWidth, opacity: 0 }} // Starts off-screen to the right
            animate={{ x: 0, opacity: 1 }} // Slides in from the right
            exit={{ x: sidebarWidth, opacity: 0 }} // Slides out to the right
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative h-full bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 text-white p-4 shadow-lg border-l border-gray-700"
            style={{
              width: `${sidebarWidth}px`,
              minWidth: `${MIN_WIDTH}px`,
              maxWidth: `${MAX_WIDTH}px`,
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 bg-gray-800 p-2 pr-3 pl-3 rounded-full hover:bg-gray-700 transition-colors text-white"
              aria-label="Close AI Assistant"
            >
              X {/* Simple 'X' icon for close */}
            </button>

            <h2 className="text-xl font-semibold mb-4 pt-8">AI Assistant</h2>
            {/* Content of your AI assistant goes here */}
            <div className="flex flex-col h-[calc(100%-60px)]">
              <div className="flex-grow overflow-y-auto">
                <p>Hello! How can I help you today?</p>
                {/* Example chat messages */}
                <div className="bg-gray-800 p-3 rounded-lg my-2">
                  <p className="text-sm">User: What's the weather like?</p>
                </div>
                <div className="bg-blue-700 p-3 rounded-lg my-2 self-end">
                  <p className="text-sm">
                    AI: I can't provide real-time weather information.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="mt-2 w-full bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Send
                </button>
              </div>
            </div>

            {/* Resizer Handle */}
            <div
              onMouseDown={() => setIsResizing(true)}
              className="absolute top-0 left-0 w-1.5 h-full cursor-col-resize z-30"
              style={{ backgroundColor: isResizing ? "#8884" : "transparent" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
