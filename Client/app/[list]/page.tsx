"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProblemsTypes } from "@/types/types_interface";
import { formatListName } from "@/lib/formatURL";
import Link from "next/link";

import styles from "../problems/problems.module.css";
import { GrNext, GrPrevious, GrSort } from "react-icons/gr";

export default function RecommendationListPage({
  params,
}: {
  params: { list: string };
}) {
  const [problems, setProblems] = useState<
    ProblemsTypes[]
  >([]);
  const { loading } = useAuth();
  const [filteredProblems, setFilteredProblems] = useState<ProblemsTypes[]>([]);
  const [filteredSortingProblems, setFilteredSortingProblems] = useState<
    ProblemsTypes[]
  >([]);
  const [isDisplaySortingModal, setIsDisplaySortingModal] =
    useState<boolean>(false);
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

  // Fetch problems from back-end
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response: Response = await fetch(
          "http://localhost:5000/data/problems"
        );
        const data: ProblemsTypes[] = await response.json();
        setProblems(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
        }
      }
    };

    fetchProblems();
  }, []);

  // Filter problems based on the list
  useEffect(() => {
    if (problems.length > 0) {
      const formattedList = formatListName(params.list);

      const filtered = problems.filter(
        (problem) =>
          problem.company?.includes(formattedList) ||
          problem.lists?.includes(formattedList) || 
          problem.tags?.includes(formattedList)
      );
      setFilteredProblems(filtered);
      setFilteredSortingProblems(filtered);
    }
  }, [problems, params.list]);

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

  // Filter problems based on selected difficulties
  const filterProblems = (selections: { [key: string]: boolean }) => {
    const selectedDifficulties = Object.keys(selections).filter(
      (key) => selections[key]
    );

    if (selectedDifficulties.length === 0) {
      setFilteredSortingProblems(filteredProblems); // Show all if no selection
    } else {
      const filtered = filteredProblems.filter((problem) =>
        selectedDifficulties.includes(problem.difficulty.toLowerCase())
      );
      setFilteredSortingProblems(filtered);
    }

    // Reset to the first page when filtering
    setCurrentPage(1);
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

  // Toggle Sorting Modal visibility
  const toggleSortingModal = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDisplaySortingModal((prev) => !prev);
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

  // Calculate the paginated problems
  const indexOfLastProblem = currentPage * itemsPerPage; // 1 * 10 = 10
  const indexOfFirstProblem = indexOfLastProblem - itemsPerPage; // 10 - 10 = 1
  const currentProblems = filteredSortingProblems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  ); // 1 -> 10

  // Pagination Controls
  const totalPages = Math.ceil(filteredSortingProblems.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.problems_pages}>
      <div className={styles.problems_content}>
        <div className={styles.problems_content_header_wrapper}>
          <h4>{formatListName(params.list)} Questions</h4>
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
          {currentPage !== 1 && (
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={styles.prev_page_btn}
            >
              <GrPrevious className={styles.pagination_btn_icon} />
            </button>
          )}
          <p>{currentPage}</p>
          {/* Next Button */}
          {currentPage !== totalPages && (
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={styles.next_page_btn}
            >
              <GrNext className={styles.pagination_btn_icon} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
