import React from "react";
import styles from "./codeEditorBtn.module.css";
import { FaPlay } from "react-icons/fa6";
import { IoMdCloudDone } from "react-icons/io";
import { CodeEditorButtonsProps } from "@/types/interfaces";

const CodeEditorButtons: React.FC<CodeEditorButtonsProps> = ({
  handleCodeSubmission,
}): JSX.Element => {
  return (
    <div className={styles.code_editor_buttons}>
      <button
        className={styles.code_editor_run_btn}
        onClick={handleCodeSubmission}
      >
        <FaPlay className={styles.code_editor_icon} />
        <p className={styles.code_editor_buttons_txt}>Run</p>
      </button>
      <button className={styles.code_editor_submit_btn}>
        <IoMdCloudDone className={styles.code_editor_icon} />
        <p className={styles.code_editor_buttons_txt}>Submit</p>
      </button>
    </div>
  );
};

export default CodeEditorButtons;
