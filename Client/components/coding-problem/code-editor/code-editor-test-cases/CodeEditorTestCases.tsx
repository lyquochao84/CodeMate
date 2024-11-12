import React, { useEffect, useState } from "react";
import styles from "./codeEditorTestCases.module.css";
import { ProblemDetailsProps } from "@/types/interfaces";
import { HiOutlineCodeBracketSquare } from "react-icons/hi2";

const CodeEditorTestCases: React.FC<ProblemDetailsProps> = ({
  problemDetails,
  submissionResults,
  isSubmissionTriggered,
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenTestCases, setIsOpenTestCases] = useState<boolean>(false);
  const [activeTestCase, setActiveTestCase] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("Test Case");
  const [testResults, setTestResults] = useState<string[]>([]);
  const [outputs, setOutputs] = useState<
    { actual: string; expected: string }[]
  >([]);

  // Effect to handle the loading delay after "Run" is triggered
  useEffect(() => {
    if (isSubmissionTriggered) {
      setIsLoading(true); // Start loading

      const timer = setTimeout(() => {
        setIsLoading(false); // End loading after 1.5 seconds
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isSubmissionTriggered]);

  // Function to process the test results based on Judge0 API and expected output
  useEffect(() => {
    if (submissionResults && problemDetails) {
      const actualOutputs = submissionResults.stdout.trim().split("\n");

      const results = problemDetails.testCases.map((testCase, index) => {
        const expectedOutput = JSON.stringify(testCase.output).replace(
          /\s+/g,
          ""
        );
        const actualOutput = actualOutputs[index]?.trim().replace(/\s+/g, "");
        return actualOutput === expectedOutput ? "Accepted" : "Not Accepted";
      });

      setTestResults(results);

      const outputDetails = problemDetails.testCases.map((testCase, index) => ({
        actual: actualOutputs[index]?.trim().replace(/\s+/g, "") || "No output",
        expected: JSON.stringify(testCase.output),
      }));
      setOutputs(outputDetails);
    }
  }, [submissionResults, problemDetails]);

  const handleTestCaseClick = (index: number): void => {
    setActiveTestCase(index);
  };

  const handleChangeTab = (tab: string): void => {
    setActiveTab(tab);
  };

  const handleOpenTestCasesModal = (): void => {
    setIsOpenTestCases((prev) => !prev);
  };

  const runTime = Math.floor(submissionResults?.time);
  const testCaseHeader = testResults.every((result) => result === "Accepted")
    ? "Accepted"
    : "Not Accepted";

  return (
    <div className={styles.code_editor_test_cases_wrapper}>
      {!isOpenTestCases ? null : (
        <div className={styles.code_editor_test_cases_open_modal}>
          <div className={styles.code_editor_test_cases_header}>
            <p
              onClick={() => handleChangeTab("Test Case")}
              className={`${styles.tab} ${
                activeTab === "Test Case" ? styles.activeTab : ""
              }`}
            >
              Test Cases
            </p>
            <p
              onClick={() => handleChangeTab("Output")}
              className={`${styles.tab} ${
                activeTab === "Output" ? styles.activeTab : ""
              }`}
            >
              Output
            </p>
          </div>
          <div className={styles.code_editor_test_cases_content}>
            {activeTab === "Test Case" ? (
              <>
                <div
                  className={styles.code_editor_test_cases_content_wrapper_btn}
                >
                  {problemDetails?.testCases?.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.test_case_btn} 
                                      ${
                                        activeTestCase === index
                                          ? styles.active
                                          : ""
                                      }`}
                      onClick={() => handleTestCaseClick(index)}
                    >
                      Case {index + 1}
                    </button>
                  ))}
                </div>
                {problemDetails?.testCases && (
                  <div className={styles.test_case_details}>
                    {Object.entries(
                      problemDetails.testCases[activeTestCase].input
                    ).map(([key, value]) => (
                      <>
                        <p className={styles.test_case_details_key}>{key} =</p>
                        <div
                          className={styles.test_case_details_values_wrapper}
                        >
                          <strong>{JSON.stringify(value)}</strong>
                        </div>
                      </>
                    ))}
                  </div>
                )}
              </>
            ) : testResults.length > 0 ? (
              <>
                {isLoading ? (
                  <div className={styles.loadingScreen}>Loading...</div>
                ) : (
                  <>
                    <div className={styles.test_case_header_wrapper}>
                      <h4
                        className={`${
                          testCaseHeader === "Accepted"
                            ? styles.test_case_header
                            : styles.test_case_header_notAccepted
                        }`}
                      >
                        {testCaseHeader}
                      </h4>
                      <p className={styles.test_case_run_time}>
                        Runtime: {runTime} ms
                      </p>
                    </div>
                    <div
                      className={
                        styles.code_editor_test_cases_content_wrapper_btn
                      }
                    >
                      {problemDetails?.testCases?.map((_, index) => (
                        <button
                          key={index}
                          className={`${styles.test_case_btn} 
                                        ${
                                          activeTestCase === index
                                            ? styles.active
                                            : ""
                                        }
                                        ${
                                          testResults[index] === "Accepted"
                                            ? styles.test_successfully_txt
                                            : styles.test_failed_txt
                                        }`}
                          onClick={() => handleTestCaseClick(index)}
                        >
                          Case {index + 1}
                        </button>
                      ))}
                    </div>
                    {outputs[activeTestCase] && (
                      <div className={styles.test_case_details_output}>
                        <strong>Expected Output:</strong>{" "}
                        <p>{outputs[activeTestCase].expected}</p>
                        <strong>Actual Output:</strong>{" "}
                        <p>{outputs[activeTestCase].actual}</p>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div></div> // Blank div if no test results
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
