"use client";
import { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor"; // Only for types
import { socket } from "@/lib/socket";

export default function MonacoEditorComponent() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const isRemoteChange = useRef(false);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-room", { roomId: "1" });
    socket.on("receive-changes", handleReceiveChanges);

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
  };

  // Example: Emit code when changed
  const handleChange = (value: string | undefined) => {
    if (isRemoteChange.current) {
      isRemoteChange.current = false; // Reset the flag
      return; // Don't emit if it's a remote change
    }
    if (value !== undefined) {
      //:TODO add room id
      socket.emit("code-change", { roomId: "1", code: value });
      console.log("Code emmitted:", value);
    }
  };

  // Example: Updating editor content from socket
  const updateEditorContent = (newCode: string) => {
    const editor = editorRef.current;
    if (editor && editor.getValue() !== newCode) {
      isRemoteChange.current = true;
      editor.setValue(newCode); // ← This updates the editor
    }
  };

  return (
    <Editor
      height="90vh"
      theme="vs-dark"
      defaultLanguage="javascript"
      defaultValue="// Start typing..."
      onMount={handleEditorDidMount}
      onChange={handleChange}
    />
  );
}
