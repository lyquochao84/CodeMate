"use client";
import React, { useEffect, useState } from "react";
import styles from "./codingChallenge.module.css";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
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
  params: { title: string; roomId?: string }; // Accept roomId as optional
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
  const [roomId, setRoomId] = useState<string | null>(params.roomId || null); // Store roomId from params if available

  // Initialize socket and join room if roomId exists
  useEffect(() => {
    if (roomId) {
      socket.emit("joinRoom", roomId);

      // Listen for code updates
      socket.on("receiveCodeUpdate", (newCode: string) => {
        setCode(newCode);
      });
    }
  }, [roomId]);

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

  // Function to handle code change and emit code updates
  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
    
    // If there is live coding, update the code for everyone in the room
    if (roomId) {
      socket.emit("codeUpdate", { roomId, code: value });
    }
  };

  // Handle code submission
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

    const data = await response.json();
    setSubmissionResults(data);
    setIsSubmissionTriggered(true);
  };

  // Generate random room ID
  const handleGenerateRoomId = () => {
    const generatedId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setRoomId(generatedId);
  };

  // Handle creating or joining a room
  const handleCreateRoom = (): void => {
    if (roomId) {
      socket.emit("joinRoom", roomId); // Join room on server
      router.push(`/problems/${params.title}/${roomId}`);
    }
  };
  
  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.coding_problem_page}>
      <CodingInstruction problemDetails={problemDetails} />
      <div className={styles.coding_problem_code_editor}>
        <CodeEditorHeader
          language={language}
          handleChooseLanguage={(selectedLanguage) =>
            setLanguage(selectedLanguage)
          }
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleCodeSubmission={handleCodeSubmission}
        />
        <CodeEditor
          language={language.toLowerCase()}
          onChange={handleCodeChange}
        />
        <CodeEditorTestCases
          problemDetails={problemDetails}
          submissionResults={submissionResults}
          isSubmissionTriggered={isSubmissionTriggered}
          roomId={roomId}
          handleGenerateRoomId={handleGenerateRoomId}
          handleCreateRoom={handleCreateRoom}
        />
      </div>
    </div>
  );
}
