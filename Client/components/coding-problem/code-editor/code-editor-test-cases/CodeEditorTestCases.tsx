import React, { useState, useRef } from "react";
import styles from "./codeEditorTestCases.module.css";
import { ProblemDetailsProps } from "@/types/interfaces";
import { HiOutlineCodeBracketSquare } from "react-icons/hi2";

const CodeEditorTestCases: React.FC<ProblemDetailsProps> = ({
  problemDetails,
}): JSX.Element => {
  const [isOpenTestCases, setIsOpenTestCases] = useState<boolean>(false);
  const [activeTestCase, setActiveTestCase] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("Test Case"); 

  const testcase_tab = useRef<HTMLParagraphElement | null>(null);
  const output_tab = useRef<HTMLParagraphElement | null>(null);

  // Toggle the test cases modal
  const handleOpenTestCasesModal = (): void => {
    setIsOpenTestCases((prev) => !prev);
  };

  // Set active test case when a button is clicked
  const handleTestCaseClick = (index: number): void => {
    setActiveTestCase(index);
  };

  // Handle changing tabs
  const handleChangeTab = (tab: string): void => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.code_editor_test_cases_wrapper}>
      {!isOpenTestCases ? (
        <></>
      ) : (
        <div className={styles.code_editor_test_cases_open_modal}>
          <div className={styles.code_editor_test_cases_header}>
            <p onClick={() => handleChangeTab("Test Case")}
               className={`${styles.tab} ${activeTab === "Test Case" ? styles.activeTab : ""}`}>
                Test Case
            </p>
            <p onClick={() => handleChangeTab("Output")}
               className={`${styles.tab} ${activeTab === "Output" ? styles.activeTab : ""}`}>
                Output
            </p>
          </div>
          <div className={styles.code_editor_test_cases_content}>
            {activeTab === "Test Case" ? (<>
              {/* Render test case buttons */}
              <div className={styles.code_editor_test_cases_content_wrapper_btn}>
                {problemDetails?.testCases?.map((_, index) => (
                  <button key={index} 
                          className={`${styles.test_case_btn} 
                                      ${activeTestCase === index ? styles.active : ""
                                    }`}
                          onClick={() => handleTestCaseClick(index)}
                  >
                    Case {index + 1}
                  </button>
                ))}
              </div>
              {/* Display the active test case details */}
              {problemDetails?.testCases && (
                <div className={styles.test_case_details}>
                  {Object.entries(problemDetails.testCases[activeTestCase].input).map(([key, value]) => (
                    <>
                      <p className={styles.test_case_details_key}>{key} =</p>
                      <div className={styles.test_case_details_values_wrapper}>
                        <strong>{value}</strong>
                      </div>
                    </>
                  ))}
                </div>
              )}
            </>) : (
              <>
                
              </>
            )}
          </div>
        </div>
      )}
      <button
        className={styles.code_editor_test_cases_close_modal}
        onClick={handleOpenTestCasesModal}
      >
        <p>Console</p>
        <HiOutlineCodeBracketSquare className={styles.brackets_icon} />
      </button>
    </div>
  );
};

export default CodeEditorTestCases;
