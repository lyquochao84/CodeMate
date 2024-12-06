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
import { CodingProblemPageProps, ProblemsTypes } from "@/types/interfaces";
import { formatURL } from "@/lib/formatURL";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useCoding } from "@/hooks/useCoding";
import { SubmissionResult } from "@/types/type";

export default function CodingProblemPage({
  params,
  roomUsers,
}: CodingProblemPageProps) {
  const router: AppRouterInstance = useRouter();
  const { loading } = useAuth();
  const { language, setLanguage, code, setCode } = useCoding();
  const [problemDetails, setProblemDetails] = useState<ProblemsTypes | null>(
    null
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [submissionResults, setSubmissionResults] = useState<SubmissionResult | null>(null);
  const [isSubmissionTriggered, setIsSubmissionTriggered] =
    useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>("");
  const [isOpenTestCases, setIsOpenTestCases] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Test Case");

  // Fetch problem details
  useEffect(() => {
    const fetchProblemsData = async () => {
      try {
        const response: Response = await fetch(
          `http://${process.env.SERVER_PRODUCTION}/data/problems`,
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
  }, [params.title]);

  // Handle choose language
  const handleChooseLanguage = (selectedLanguage: string): void => {
    setLanguage(selectedLanguage);
    setIsOpen((prev) => !prev);
    if (params.id) {
      socket.emit("update-language", {
        roomId: params.id,
        languageUsed: selectedLanguage,
      });
      socket.emit("sync-language", { roomId: params.id });
    }
  };

  const handleChangeCode = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);

    if (params.id) {
      socket.emit("update-code", { roomId: params.id, code: newCode });
      socket.emit("sync-code", { roomId: params.id });
    }
  };

  // Handle code submission
  const handleCodeSubmission = async (): Promise<void> => {
    if (!code || !language) {
      alert("Please enter code and select a language.");
      return;
    }

    const response: Response = await fetch(
      `http://${process.env.SERVER_PRODUCTION}/code/submission`,
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
    setIsOpenTestCases(true);
    setActiveTab("Output");
  };

  // Generate random room ID
  const handleGenerateRoomId = () => {
    const generatedId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setRoomId(generatedId);
  };

  // Handle creating or joining a room
  const handleCreateRoom = async (): Promise<void> => {
    if (!roomId) {
      alert("Please Generate Room ID");
      return;
    }

    try {
      const response: Response = await fetch(
        `http://${process.env.SERVER_PRODUCTION}/room/create-room`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId,
            title: params.title,
          }),
        }
      );

      const data = await response.json();

      if (data.message === "Room created successfully!") {
        router.push(`/problems/${params.title}/${roomId}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
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
        <CodeEditor
          language={language?.toLowerCase()}
          onChange={handleChangeCode}
          code={code}
          roomId={params.id}
        />
        <CodeEditorTestCases
          problemTitle={formatURL(params.title)}
          problemDetails={problemDetails}
          submissionResults={submissionResults}
          isSubmissionTriggered={isSubmissionTriggered}
          roomId={roomId}
          roomUsers={roomUsers}
          paramsId={params.id}
          handleGenerateRoomId={handleGenerateRoomId}
          handleCreateRoom={handleCreateRoom}
          isOpenTestCases={isOpenTestCases}
          setIsOpenTestCases={setIsOpenTestCases}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}
