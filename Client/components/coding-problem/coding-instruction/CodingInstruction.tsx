import React, { useState, useEffect } from "react";
import styles from "./codingInstruction.module.css";
import { ProblemDetailsProps, ProblemsTypes } from "@/types/interfaces";
import { formatURL } from "@/lib/formatURL";

const CodingInstruction: React.FC<ProblemDetailsProps> = ({ params }): JSX.Element => {
  const [problemDetails, setProblemDetails] = useState<ProblemsTypes | null>(null); 

  // Fetch problem details
  useEffect(() => {
    const fetchProblemsData = async () => {
      try {
        const response: Response = await fetch(
          "http://localhost:5000/data/problems",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: formatURL(params.title) }),
            credentials: "include",
          }
        );
        const data = await response.json();
        setProblemDetails(data.problem);
      } 
      catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error);
        }
      }
    };

    fetchProblemsData();
  }, []);

  // Change styles for difficulty
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return styles.easy;
      case "medium":
        return styles.medium;
      case "hard":
        return styles.hard;
      default:
        return "";
    }
  };

  // Early return if data hasn't loaded yet
  if (!problemDetails) return <div>Loading...</div>;

  return (
    <div className={styles.coding_instruction_part}>
     <h3 className={styles.coding_instruction_title}>{problemDetails.title}</h3>
      <div className={styles.coding_instruction_details}>
        <p className={`${getDifficultyClass(problemDetails?.difficulty || "")} ${styles.coding_instruction_difficulty}`}>
          {problemDetails?.difficulty}
        </p>
        {problemDetails?.tags.map((tag, index) => (
          <p key={index} className={styles.coding_instruction_tag}>{tag}</p>
        ))}
      </div>
      <div className={styles.coding_instruction_content}>
        <h4>Description</h4>
        <p className={styles.coding_instruction_description}>{problemDetails?.description}</p>
        {problemDetails?.examples?.map((example, index) => (
          <div key={index} className={styles.coding_instruction_examples}>
            <p className={styles.coding_instruction_description_example}>Example:</p>
            <p className={styles.coding_instruction_examples_text}>
              <strong>Input: </strong>{example.input}
            </p>
            <p className={styles.coding_instruction_examples_text}>
              <strong>Output: </strong>{example.output}
            </p>
            {example.explanation && (
              <p className={styles.coding_instruction_examples_text}>
                <strong>Explanation: </strong>{example.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodingInstruction;
