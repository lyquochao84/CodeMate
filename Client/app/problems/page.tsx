"use client";
import React, { useState, useEffect, useRef } from "react";
import { ProblemsTypes } from "@/types/types_interface";
import { useAuth } from "@/hooks/useAuth";
import { GrSort, GrPrevious, GrNext } from "react-icons/gr";
import Link from "next/link";

import styles from "./problems.module.css";

const Problems: React.FC = (): JSX.Element => {
  const { loading } = useAuth();
  const [problems, setProblems] = useState<ProblemsTypes[]>([]);
  const [isDisplaySortingModal, setIsDisplaySortingModal] =
    useState<boolean>(false);
  const [filteredProblems, setFilteredProblems] = useState<ProblemsTypes[]>([]);
  const [difficultySelections, setDifficultySelections] = useState<{
    [key: string]: boolean;
  }>({
    easy: false,
    medium: false,
    hard: false,
  });

  const modalRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Fetch all the problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response: Response = await fetch(
          "http://localhost:5000/data/problems"
        );
        const problemsData = await response.json();
        setProblems(problemsData);
        setFilteredProblems(problemsData); // Initially show all problems
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error);
        }
      }
    };
    fetchProblems();
  }, []);

  // Calculate the paginated problems
  const indexOfLastProblem = currentPage * itemsPerPage; // 1 * 10 = 10
  const indexOfFirstProblem = indexOfLastProblem - itemsPerPage; // 10 - 10 = 1
  const currentProblems = filteredProblems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  ); // 1 -> 10

  // Helper function to get class based on difficulty
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return styles.easy;
      case "medium":
        return styles.medium;
      case "hard":
        return styles.hard;
      default:
        return "";
    }
  };

  // Toggle Sorting Modal visibility
  const toggleSortingModal = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDisplaySortingModal((prev) => !prev);
  };

  // Handle checkbox change
  const handleDifficultyChange = (difficulty: string) => {
    setDifficultySelections((prevSelections) => {
      const updatedSelections = {
        ...prevSelections,
        [difficulty]: !prevSelections[difficulty],
      };
      filterProblems(updatedSelections);
      return updatedSelections;
    });
  };

  // Filter problems based on selected difficulties
  const filterProblems = (selections: { [key: string]: boolean }) => {
    const selectedDifficulties = Object.keys(selections).filter(
      (key) => selections[key]
    );

    if (selectedDifficulties.length === 0) {
      setFilteredProblems(problems); // Show all if no selection
    } else {
      const filtered = problems.filter((problem) =>
        selectedDifficulties.includes(problem.difficulty.toLowerCase())
      );
      setFilteredProblems(filtered);
    }

    // Reset to the first page when filtering
    setCurrentPage(1);
  };

  // Handle clicks outside the modal
  const handleClickOutside = (event: MouseEvent) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(event.target as Node) &&
      iconRef.current &&
      !iconRef.current.contains(event.target as Node)
    ) {
      setIsDisplaySortingModal(false); // Close the modal
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the modal
    if (isDisplaySortingModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDisplaySortingModal]);

  // Pagination Controls
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Loading State
  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.problems_page}>
      <div className={styles.problems_content}>
        <div className={styles.problems_content_header_wrapper}>
          <h4>All Problems</h4>
          <div ref={iconRef}>
            <GrSort
              className={styles.problems_content_header_wrapper_icon}
              onClick={toggleSortingModal}
            />
          </div>
        </div>
        {/* Sorting Modal */}
        {isDisplaySortingModal && (
          <div className={styles.sorting_modal} ref={modalRef}>
            <label>
              <input
                type="checkbox"
                checked={difficultySelections.easy}
                onChange={() => handleDifficultyChange("easy")}
              />
              Easy
            </label>
            <label>
              <input
                type="checkbox"
                checked={difficultySelections.medium}
                onChange={() => handleDifficultyChange("medium")}
              />
              Medium
            </label>
            <label>
              <input
                type="checkbox"
                checked={difficultySelections.hard}
                onChange={() => handleDifficultyChange("hard")}
              />
              Hard
            </label>
          </div>
        )}
        <div className={styles.problems_list_item}>
          {currentProblems.length > 0 &&
            currentProblems.map((item, index) => (
              <Link href="/" className={styles.problems_item_link} key={index}>
                <div className={styles.problems_item}>
                  <div className={styles.problems_item_header}>
                    <h5>{item.title}</h5>
                    <p className={getDifficultyClass(item.difficulty)}>
                      {item.difficulty}
                    </p>
                  </div>
                  <div className={styles.problems_item_status_wrapper}>
                    <button className={styles.problems_item_button}>
                      Start Coding
                    </button>
                  </div>
                </div>
              </Link>
            ))}
        </div>
        {/* Pagination Controls */}
        <div className={styles.pagination}>
          {/* Previous Button */}
          {currentPage !== 1 && <button onClick={handlePrevPage} disabled={currentPage === 1} className={styles.prev_page_btn}>
            <GrPrevious className={styles.pagination_btn_icon} />
          </button>}
          <p>
            {currentPage}
          </p>
          {/* Next Button */}
          {currentPage !== totalPages && <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={styles.next_page_btn}
          >
            <GrNext className={styles.pagination_btn_icon} />
          </button>}
        </div>
      </div>
    </div>
  );
};

export default Problems;
