import React from "react";
import styles from "./pagination.module.css";
import { GrNext, GrPrevious } from "react-icons/gr";
import { PaginationProps } from "@/types/interfaces";

const Pagination: React.FC<PaginationProps> = ({ currentPage, handlePrevPage, handleNextPage, totalPages }): JSX.Element => {
  return (
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
  );
};

export default Pagination;
