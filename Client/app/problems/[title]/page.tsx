"use client";
import React, { useEffect, useState } from "react";
import styles from "./codingChallenge.module.css";
import { useAuth } from "@/hooks/useAuth";
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
  const { loading } = useAuth();
  const [problemDetails, setProblemDetails] = useState<ProblemsTypes | null>(
    null
  );
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tokens, setTokens] = useState<string[]>([]);
  const [submissionResults, setSubmissionResults] = useState<any[]>([]);

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

  // Function to handle code change
  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
  };

  // Handle Code Submission
  let convertedLanguage = language.toLowerCase();
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
        body: JSON.stringify({ code, language }),
      }
    );

    const data = await response.json();
    setTokens(data.tokens);
  };

  // Function to fetch results using tokens
  useEffect(() => {
    try {
      const fetchResults = async () => {
        const response: Response = await fetch(
          `http://localhost:5000/code/submission/results?tokens=${tokens.join(
            ","
          )}`
        );
        const data = await response.json();
        setSubmissionResults(data);
      };

      fetchResults();
    } catch (error) {
      console.log(error);
    }
  }, [tokens]);

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
        <CodeEditorTestCases problemDetails={problemDetails} />
      </div>
    </div>
  );
}
