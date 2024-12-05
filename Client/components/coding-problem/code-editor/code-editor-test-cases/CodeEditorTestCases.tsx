import React, { useEffect, useState } from "react";
import styles from "./codeEditorTestCases.module.css";
import { ProblemDetailsProps } from "@/types/interfaces";
import { HiOutlineCodeBracketSquare } from "react-icons/hi2";
import { FaUserFriends } from "react-icons/fa";
import CollaborationModal from "@/components/collaboration-modal/CollaborationModal";
import { IoChatbubble } from "react-icons/io5";
import { IoIosStarOutline } from "react-icons/io";
import { IoMdStar } from "react-icons/io";
import ChatWindow from "@/components/chat-window/ChatWindow";
import LoadingScreen from "@/components/loading-screen/LoadingScreen";
import socket from "@/config/socket_io";

const CodeEditorTestCases: React.FC<ProblemDetailsProps> = ({
  problemTitle,
  problemDetails,
  submissionResults,
  isSubmissionTriggered,
  roomId,
  roomUsers,
  paramsId,
  handleGenerateRoomId,
  handleCreateRoom,
  activeTab,
  setActiveTab,
  isOpenTestCases,
  setIsOpenTestCases,
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTestCase, setActiveTestCase] = useState<number>(0);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [outputs, setOutputs] = useState<
    { actual: string; expected: string }[]
  >([]);
  const [isOpenCollaborationModal, setIsOpenCollaborationModal] =
    useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<
    { username: string; message: string }[]
  >([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

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

  useEffect(() => {
    // Listen for incoming messages
    socket.on(
      "receive-message",
      (data: { username: string; message: string }) => {
        setMessages((prev) => [...prev, data]);
      }
    );

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const handleTestCaseClick = (index: number): void => {
    setActiveTestCase?.(index);
  };

  const handleChangeTab = (tab: string): void => {
    setActiveTab?.(tab);
  };

  const handleOpenTestCasesModal = (): void => {
    setIsOpenTestCases?.((prev) => !prev);
  };

  const handleOpenChat = (): void => {
    setIsChatOpen((prev) => !prev);
  };

  const runTime = Math.floor(submissionResults?.time);
  const testCaseHeader = testResults.every((result) => result === "Accepted")
    ? "Accepted"
    : "Not Accepted";

  // Handle open modal
  const handleOpenCollaborationModal = (): void => {
    setIsOpenCollaborationModal((prev) => !prev);
  };

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
                      problemDetails.testCases[activeTestCase || 0].input
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
                  <div className={styles.loadingScreen}>
                    <LoadingScreen />
                  </div>
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
                    {outputs[activeTestCase || 0] && (
                      <div className={styles.test_case_details_output}>
                        <strong>Expected Output:</strong>{" "}
                        <p>{outputs[activeTestCase || 0].expected}</p>
                        <strong>Actual Output:</strong>{" "}
                        <p>{outputs[activeTestCase || 0].actual}</p>
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

      {/* Left buttons */}
      <div className={styles.code_editor_bottom_wrapper}>
        <button
          className={styles.code_editor_test_cases_close_modal}
          onClick={handleOpenTestCasesModal}
        >
          <p>Console</p>
          <HiOutlineCodeBracketSquare className={styles.brackets_icon} />
        </button>
        {!paramsId && (
          <button
            className={styles.code_editor_test_cases_close_modal}
            onClick={handleOpenCollaborationModal}
          >
            <FaUserFriends className={styles.code_editor_collaboration_icon} />
            <p className={styles.code_editor_buttons_txt}>Room</p>
          </button>
        )}
        {paramsId && (
          <div className={styles.chat_icon_wrapper}>
            <IoChatbubble
              className={styles.chat_icon}
              onClick={handleOpenChat}
            />
          </div>
        )}
      </div>

      {isOpenCollaborationModal && (
        <CollaborationModal
          onClose={handleOpenCollaborationModal}
          roomId={roomId}
          handleGenerateRoomId={handleGenerateRoomId}
          handleCreateRoom={handleCreateRoom}
        />
      )}
      {isChatOpen && (
        <ChatWindow
          roomUsers={roomUsers || []}
          messages={messages}
          setMessages={setMessages}
        />
      )}
    </div>
  );
};

export default CodeEditorTestCases;
