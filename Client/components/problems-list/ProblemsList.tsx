import React from "react";
import styles from "./problemsList.module.css";
import Link from "next/link";
import { ProblemsListProps } from "@/types/interfaces";

const ProblemsList: React.FC<ProblemsListProps> = ({
  currentProblems,
  getDifficultyClass,
}): JSX.Element => {
  return (
    <div className={styles.problems_list_item}>
      {currentProblems.length > 0 &&
        currentProblems.map((item, index) => {
          const formattedTitle = item.title.toLowerCase().replace(/\s+/g, "-");

          return (
            <Link
              href={`/problems/${formattedTitle}`}
              className={styles.problems_item_link}
              key={index}
            >
              <div className={styles.problems_item}>
                <div className={styles.problems_item_header}>
                  <h5>{item.title}</h5>
                  <p className={getDifficultyClass(item.difficulty)}>
                    {item.difficulty}
                  </p>
                </div>
                <div className={styles.problems_item_status_wrapper}>
                  <button className={styles.problems_item_button}>
                    Start Coding
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default ProblemsList;
