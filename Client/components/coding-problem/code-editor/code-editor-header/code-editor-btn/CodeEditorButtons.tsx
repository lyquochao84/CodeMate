import React from "react";
import styles from "./codeEditorBtn.module.css";
import { FaPlay } from "react-icons/fa6";
import { FaCopy } from "react-icons/fa";
import { CodeEditorButtonsProps } from "@/types/interfaces";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

const CodeEditorButtons: React.FC<CodeEditorButtonsProps> = ({
  handleCodeSubmission,
}): JSX.Element => {
  const params = useParams();
  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;

  const copyId = (id: string): void => {
    try {
      navigator.clipboard.writeText(id);
      toast.success("Copied Room ID");
    }
    catch(error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      }
    }
  }

  return (
    <div className={styles.code_editor_buttons}>
      <button
        className={styles.code_editor_run_btn}
        onClick={handleCodeSubmission}
      >
        <FaPlay className={styles.code_editor_icon} />
        <p className={styles.code_editor_buttons_txt}>Run</p>
      </button>
      {roomId ? (
        <button className={styles.code_editor_submit_btn} onClick={() => copyId(roomId)}>
          <FaCopy className={styles.code_editor_icon} />
          <p className={styles.code_editor_buttons_txt}>Copy ID</p>
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default CodeEditorButtons;
