import React from "react";
import styles from "./codeEditorHeader.module.css";
import CodeEditorButtons from "./code-editor-btn/CodeEditorButtons";
import CodeEditorDropdown from "./code-editor-dropdown/CodeEditorDropdown";
import { CodeEditorHeaderProps } from "@/types/interfaces";

const CodeEditorHeader: React.FC<CodeEditorHeaderProps> = ({
  isOpen,
  setIsOpen,
  language,
  handleChooseLanguage,
  handleCodeSubmission
}): JSX.Element => {
  return (
    <div className={styles.code_editor_header}>
      <CodeEditorButtons handleCodeSubmission={handleCodeSubmission} />
      <CodeEditorDropdown
        language={language}
        handleChooseLanguage={handleChooseLanguage}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default CodeEditorHeader;
