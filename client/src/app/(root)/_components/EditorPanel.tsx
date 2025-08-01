"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useRef, useEffect, useCallback } from "react";
import * as monaco from "monaco-editor"; // Only for types
import { socket } from "@/lib/socket";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { RotateCcwIcon, TypeIcon } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";
import useMounted from "@/hooks/useMounted";
import { debounce } from "lodash";
import axios from "axios";
import { useAssistantStore } from "@/store/useAssistantStore";
import Image from "next/image";
function EditorPanel() {
  const clerk = useClerk();
  const pathName = usePathname();
  const roomId = pathName.split("/")[2];
  //for editor
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const pendingCodeRef = useRef<string | null>(null);
  const isRemoteChange = useRef(false);
  const setShowAssistant = useAssistantStore((state) => state.setShowAssistant);
  const setAssistantResponse = useAssistantStore(
    (state) => state.setAssistantResponse
  );

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("receive-changes", handleReceiveChanges);
    socket.emit("join-room", { roomId: roomId });

    return () => {
      socket.off("receive-changes", handleReceiveChanges);
      socket.disconnect();
    };
  }, []);
  const handleReceiveChanges = (data: string) => {
    updateEditorContent(data);
  };
  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;
    if (pendingCodeRef.current) {
      isRemoteChange.current = true;
      editor.setValue(pendingCodeRef.current);
      console.log("Flushed pending code on mount");
      pendingCodeRef.current = null;
    }
    editor.addAction({
      id: "myPaste",
      label: "Ask AI for Suggestion",
      precondition: undefined,
      contextMenuGroupId: "MYPORTION",
      contextMenuOrder: 1.5,
      run: async (editor) => {
        const code = editor.getValue();
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/ask-suggestion`,
          {
            code,
          }
        );
        setShowAssistant(true);
        setAssistantResponse(response.data.answer);
        //         updateEditorContent(response.data.answer);
      },
    });
  };
  const emitCodeChange = useCallback(
    debounce((value: string) => {
      socket.emit("code-change", { roomId, code: value });
    }, 500),
    []
  );
  const handleChange = (value: string | undefined) => {
    if (isRemoteChange.current) {
      isRemoteChange.current = false;
      return;
    }
    if (value !== undefined) {
      emitCodeChange(value);
    }
  };

  const updateEditorContent = (newCode: string) => {
    const editor = editorRef.current;
    if (editor && editor.getValue() !== newCode) {
      const currentCode = editor.getValue();
      if (currentCode === newCode) return;

      const currentPosition = editor.getPosition();
      isRemoteChange.current = true;
      editor.setValue(newCode);
      if (currentPosition) {
        editor.setPosition(currentPosition);
      }
    } else {
      console.warn("❌ Editor not ready yet");
      pendingCodeRef.current = newCode;
    }
  };

  const { language, theme, fontSize, setFontSize } = useCodeEditorStore();

  const mounted = useMounted();

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  const handleRefresh = () => {
    const editor = editorRef.current;
    if (editor) editor.setValue(" ");
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    console.log(defaultCode);
    // if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    handleChange(value);
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };

  if (!mounted) return null;

  return (
    <div className="relative">
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Image
                src={"/" + language + ".png"}
                alt="Logo"
                width={24}
                height={24}
              />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">
                Collab Code Editor
              </h2>
              <p className="text-xs text-gray-500">
                Write and execute your code
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Font Size Slider */}
            <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
              <TypeIcon className="size-4 text-gray-400" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) =>
                    handleFontSizeChange(parseInt(e.target.value))
                  }
                  className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                  {fontSize}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="size-4 text-gray-400" />
            </motion.button>

            {/* Share Button */}
            {/* <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
            >
              <ShareIcon className="size-4 text-white" />
              <span className="text-sm font-medium text-white ">Share</span>
            </motion.button> */}
          </div>
        </div>

        {/* Editor  */}
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          {clerk.loaded && (
            <Editor
              height="600px"
              language={LANGUAGE_CONFIG[language].monacoLanguage}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={defineMonacoThemes}
              onMount={handleEditorDidMount}
              // onMount={(editor) => setEditor(editor)}
              options={{
                minimap: { enabled: false },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                contextmenu: true,
                renderLineHighlight: "all",
                lineHeight: 1.6,
                letterSpacing: 0.5,
                roundedSelection: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
              }}
            />
          )}

          {!clerk.loaded && <EditorPanelSkeleton />}
        </div>
      </div>
      {/* {isShareDialogOpen && <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />} */}
    </div>
  );
}
export default EditorPanel;
