"use client";
import React, { useEffect, useState } from "react";
import styles from "./codingChallenge.module.css";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import socket from "@/config/socket_io";
import CodingInstruction from "@/components/coding-problem/coding-instruction/CodingInstruction";
import CodeEditor from "@/components/coding-problem/code-editor/CodeEditor";
import CodeEditorHeader from "@/components/coding-problem/code-editor/code-editor-header/CodeEditorHeader";
import CodeEditorTestCases from "@/components/coding-problem/code-editor/code-editor-test-cases/CodeEditorTestCases";
import { ProblemsTypes } from "@/types/interfaces";
import { formatURL } from "@/lib/formatURL";

export default function CodingProblemPage({
  params,
}: {
  params: { title: string };
}) {
  const router = useRouter();
  const { loading } = useAuth();
  const [problemDetails, setProblemDetails] = useState<ProblemsTypes | null>(
    null
  );
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [submissionResults, setSubmissionResults] = useState<any>(null);
  const [isSubmissionTriggered, setIsSubmissionTriggered] =
    useState<boolean>(false);
  const [roomId, setRoomId] = useState<string | null>(null); // Store roomId

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
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error);
        }
      }
    };

    fetchProblemsData();
  }, []);

  // Choose language and close dropdown
  const handleChooseLanguage = (selectedLanguage: string): void => {
    setLanguage(selectedLanguage);
    setIsOpen(false);
  };
  let convertedLanguage = language.toLowerCase();

  // Function to handle code change
  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
  };

  // Handle Code Submission
  const handleCodeSubmission = async (): Promise<void> => {
    if (!code || !language) {
      alert("Please enter code and select a language.");
      return;
    }

    const response: Response = await fetch(
      "http://localhost:5000/code/submission",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          title: formatURL(params.title),
        }),
      }
    );

    // Get token from server
    const data = await response.json();
    setSubmissionResults(data);

    // When user clicked the "Run" btn
    setIsSubmissionTriggered(true);
  };

  // Generate random ID for user
  const handleGenerateRoomId = () => {
    const generatedId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setRoomId(generatedId);
  };

  // Handle creating a new room
  const handleCreateRoom = (): void => {
    socket.emit("joinRoom", roomId); // Create a new room and join room on server
    router.push(`/problems/${params.title}/${roomId}`); // Redirect to the same problem page with roomId in the URL
  };

  // Handle joining an existing room
  const handleJoinRoom = (roomId: string): void => {
    socket.emit("joinRoom", roomId); // Join room on the server
    router.push(`/problems/${params.title}/${roomId}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.coding_problem_page}>
      <CodingInstruction problemDetails={problemDetails} />
      <div className={styles.coding_problem_code_editor}>
        <CodeEditorHeader
          language={language}
          handleChooseLanguage={handleChooseLanguage}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleCodeSubmission={handleCodeSubmission}
        />
        <CodeEditor language={convertedLanguage} onChange={handleCodeChange} />
        <CodeEditorTestCases
          problemDetails={problemDetails}
          submissionResults={submissionResults}
          isSubmissionTriggered={isSubmissionTriggered}
          roomId={roomId}
          handleGenerateRoomId={handleGenerateRoomId}
          handleCreateRoom={handleCreateRoom}
          handleJoinRoom={handleJoinRoom}
        />
      </div>
    </div>
  );
}
