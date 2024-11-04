"use client";
import React, { useState } from "react";
import styles from "./codingChallenge.module.css";
import { useAuth } from "@/hooks/useAuth";
import CodingInstruction from "@/components/coding-problem/coding-instruction/CodingInstruction";
import CodeEditor from "@/components/coding-problem/code-editor/CodeEditor";
import CodeEditorHeader from "@/components/coding-problem/code-editor/code-editor-header/CodeEditorHeader";

export default function CodingProblemPage({
  params,
}: {
  params: { title: string };
}) {
  const { loading } = useAuth();
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Choose language and close dropdown
  const handleChooseLanguage = (selectedLanguage: string): void => {
    setLanguage(selectedLanguage);
    setIsOpen(false);
  };

  // Function to handle code change 
  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
  };

  // Convert language to lowercase
  let convertedLanguage = language.toLowerCase();

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.coding_problem_page}>
      <CodingInstruction params={params} />
      <div className={styles.coding_problem_code_editor}>
        <CodeEditorHeader
          language={language}
          handleChooseLanguage={handleChooseLanguage}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <CodeEditor language={convertedLanguage} onChange={handleCodeChange} />
      </div>
    </div>
  );
}
