import React from "react";
import { Editor } from "@monaco-editor/react";
import { CodeEditorProps } from "@/types/interfaces";
import styles from "./codeEditor.module.css";

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  onChange,
  code,
}): JSX.Element => {

  return (
    <div className={styles.code_editor_part}>
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => onChange(value)}
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
