import React, { useRef, useState, useEffect } from "react";
import styles from "./codeEditorDropdown.module.css";
import programmingLanguages from "@/lib/programmingLanguages";
import { CodeEditorHeaderProps } from "@/types/interfaces";

const CodeEditorDropdown: React.FC<CodeEditorHeaderProps> = ({
  isOpen,
  setIsOpen,
  language,
  handleChooseLanguage,
}): JSX.Element => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = (): void => {
    setIsOpen((prev) => !prev);
  };

  // Handle close if user click somewhere outside the dropdown
  const handleClickDropdownOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the modal
    if (isOpen) {
      document.addEventListener("mousedown", handleClickDropdownOutside);
    } else {
      document.removeEventListener("mousedown", handleClickDropdownOutside);
    }

    // Cleanup on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickDropdownOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.code_editor_dropdown} ref={modalRef}>
      <button
        className={styles.code_editor_dropdown_wrapper}
        onClick={toggleDropdown}
      >
        {language ? (
          <p className={styles.code_editor_dropdown_txt}>{language}</p>
        ) : (
          <p className={styles.code_editor_dropdown_txt}>Languages</p>
        )}
      </button>
      {isOpen && (
        <ul className={styles.dropdown_list}>
          {programmingLanguages.map((language) => (
            <li
              key={language}
              className={styles.dropdown_item}
              onClick={() => handleChooseLanguage(language)}
            >
              {language}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CodeEditorDropdown;
