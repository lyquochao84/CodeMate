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
  params: { title: string; id?: string };
}) {
  const router = useRouter();
  const { loading } = useAuth();
  const [problemDetails, setProblemDetails] = useState<ProblemsTypes | null>(
    null
  );
  const [code, setCode] = useState<string>("");
  const [roomUsers, setRoomUsers] = useState<string[]>([]); // Store users in room
  const [language, setLanguage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [submissionResults, setSubmissionResults] = useState<any>(null);
  const [isSubmissionTriggered, setIsSubmissionTriggered] =
    useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>("");
  const { userNickname } = useAuth();

  // Socket.IO
  useEffect(() => {
    // If a room created
    if (params.id) {
      // Emit joinRoom event
      socket.emit("joinRoom", {
        room_id: params.id,
        user: { name: userNickname, id: socket.id },
      });

      // Listen for updates to the user list
      socket.on("updatedUser", (data) => {
        console.log("Received updated users:", data.users);
        setRoomUsers(data.users);
      });

      // Cleanup on component unmount
      return () => {
        socket.off("updatedUser");
      };
    }
  }, [userNickname, params.id]);

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

  // Function to handle code change and emit code updates
  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
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
  const handleCreateRoom = async (): Promise<void> => {
    if (!roomId) {
      alert("Please generate the room Id");
      return;
    }

    try {
      const response: Response = await fetch(
        "http://localhost:5000/room/create-room",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId: roomId,
            title: params.title,
            user: userNickname,
          }),
        }
      );

      const data = await response.json();
     
      if (response.status === 201) {
        router.push(`/problems/${params.title}/${roomId}`);
      }
      else {
        alert("Failed to create a room");
      }
    } 
    catch (error: unknown) {
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
          paramsId={params.id}
          roomUsers={roomUsers}
          handleGenerateRoomId={handleGenerateRoomId}
          handleCreateRoom={handleCreateRoom}
        />
      </div>
    </div>
  );
}
