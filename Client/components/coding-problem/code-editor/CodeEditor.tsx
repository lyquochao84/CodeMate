import React from "react";
import styles from "./codeEditor.module.css";
import { CodeEditorProps } from "@/types/interfaces";
import { Editor } from "@monaco-editor/react";

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  initialValue,
  onChange,
}): JSX.Element => {
  return (
    <div className={styles.code_editor_part}>
      <Editor
        height="86vh"
        language={language}
        defaultValue={initialValue}
        onChange={onChange}
        theme="vs-dark"
        options={{
          scrollBeyondLastLine: true,
          fontSize: 20,
          fontWeight: "700",
        }}
      />
    </div>
  );
};

export default CodeEditor;
