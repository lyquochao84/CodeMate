import React, { useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { CodeEditorProps } from "@/types/interfaces";
import styles from "./codeEditor.module.css";
import { ACTIONS } from "@/lib/actionsSocket";

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  onChange,
  onCodeChange,
  code,
  codeRef,
  liveCode,
  socketRef,
  roomId,
}): JSX.Element => {
  const editorRef = useRef<any>(null); // To hold the Monaco editor instance

  useEffect(() => {
    const changeLiveCode = async () => {
      if (editorRef.current) {
        editorRef.current.onDidChangeModelContent((event: any) => {
          const code = editorRef.current.getValue(); // Get the current code value
          onCodeChange?.(code);

          socketRef?.current?.emit(ACTIONS.CHANGE_CODE, {
            roomId: roomId,
            code: code,
          });
        });
      }
    };

    changeLiveCode();
  }, [editorRef?.current, onCodeChange, roomId, socketRef]);

  // Sync code received from server
  useEffect(() => {
    if (socketRef?.current) {
      socketRef?.current.on(ACTIONS.CHANGE_CODE, (data: { code: string }) => {
        const { code } = data;
        editorRef?.current?.setValue(code);
      });
    }

    return () => {
      socketRef?.current?.off(ACTIONS.CHANGE_CODE);
    }
  }, [socketRef?.current]);

  return (
    <div className={styles.code_editor_part}>
      <Editor
        height="100%"
        language={language}
        value={roomId ? liveCode : code}
        onChange={(value) =>
          roomId && onCodeChange
            ? onCodeChange(value || "")
            : onChange(value || "")
        }
        theme="vs-dark"
        options={{
          scrollBeyondLastLine: true,
          fontSize: 17,
          fontWeight: "700",
        }}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
};

export default CodeEditor;
