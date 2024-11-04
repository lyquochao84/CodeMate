import React from "react";
import styles from "./sortingModal.module.css";
import { SortingModalProps } from "@/types/interfaces";

const SortingModal: React.FC<SortingModalProps> = ({ modalRef, difficultySelections, handleDifficultyChange }): JSX.Element => {
  return (
    <div className={styles.sorting_modal} ref={modalRef}>
      <label>
        <input
          type="checkbox"
          checked={difficultySelections.easy}
          onChange={() => handleDifficultyChange("easy")}
        />
        Easy
      </label>
      <label>
        <input
          type="checkbox"
          checked={difficultySelections.medium}
          onChange={() => handleDifficultyChange("medium")}
        />
        Medium
      </label>
      <label>
        <input
          type="checkbox"
          checked={difficultySelections.hard}
          onChange={() => handleDifficultyChange("hard")}
        />
        Hard
      </label>
    </div>
  );
};

export default SortingModal;
