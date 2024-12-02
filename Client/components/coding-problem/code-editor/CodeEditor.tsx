import React, { useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { CodeEditorProps } from "@/types/interfaces";
import styles from "./codeEditor.module.css";
import { ACTIONS } from "@/lib/actionsSocket";

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  code,
  onChange,
  socketRef,
  roomId,
}): JSX.Element => {

  useEffect(() => {
    if (roomId && socketRef?.current) {
      // Listen to the event when code updated from another user
      socketRef.current.on(
        ACTIONS.CHANGE_CODE,
        (data: { roomId: string; code: string }) => {
          const { roomId, code } = data;
          console.log(`Received liveCode update: ${roomId}`, code);
          onChange(code);
        }
      );
    }

    return () => {
      if (socketRef?.current) {
        socketRef.current.off(ACTIONS.CHANGE_CODE);
      }
    };
  }, []);

  return (
    <div className={styles.code_editor_part}>
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={onChange}
        theme="vs-dark"
        options={{
          scrollBeyondLastLine: true,
          fontSize: 17,
          fontWeight: "700",
        }}
      />
    </div>
  );
};

export default CodeEditor;
