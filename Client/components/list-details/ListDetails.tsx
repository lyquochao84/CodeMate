import React, { useEffect, useRef, useState } from "react";
import styles from "./listDetails.module.css";
import { GrSort } from "react-icons/gr";
import { ListDetailsProps, ProblemsTypes } from "@/types/interfaces";
import { formatURL } from "@/lib/formatURL";
import SortingModal from "../sorting-modal/SortingModal";
import ProblemsList from "../problems-list/ProblemsList";
import Pagination from "../pagination/Pagination";

const ListDetails: React.FC<ListDetailsProps> = ({ params }): JSX.Element => {
  // Problems fetched from database based on list's name
  const [problems, setProblems] = useState<ProblemsTypes[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<ProblemsTypes[]>([]);

  // Sorting modal variables
  const [isDisplaySortingModal, setIsDisplaySortingModal] =
    useState<boolean>(false);
  const [filteredSortingProblems, setFilteredSortingProblems] = useState<
    ProblemsTypes[]
  >([]);

  // Difficulty variables
  const [difficultySelections, setDifficultySelections] = useState<{
    [key: string]: boolean;
  }>({
    easy: false,
    medium: false,
    hard: false,
  });

  // Modal + icon ref
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
      const formattedList = formatURL(params.list);

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

  // Toggle Sorting Modal visibility
  const toggleSortingModal = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDisplaySortingModal((prev) => !prev);
  };

  // Handle clicks outside the modal + useEffect part
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
    } 
    else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDisplaySortingModal]);

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

  return (
    <div className={styles.problems_content}>
      <div className={styles.problems_content_header_wrapper}>
        <h4>{formatURL(params.list)} Questions</h4>
        <div ref={iconRef}>
          <GrSort
            className={styles.problems_content_header_wrapper_icon}
            onClick={toggleSortingModal}
          />
        </div>
      </div>
      {/* Sorting Modal */}
      {isDisplaySortingModal && (
        <SortingModal
          modalRef={modalRef}
          difficultySelections={difficultySelections}
          handleDifficultyChange={handleDifficultyChange}
        />
      )}
      {/* Problems-List */}
      <ProblemsList
        currentProblems={currentProblems}
        getDifficultyClass={getDifficultyClass}
      />
      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default ListDetails;
