import React, { useState, useEffect } from "react";
import styles from "./searchResult.module.css";
import { SearchBarProps } from "@/types/interfaces";
import Link from "next/link";
import { formatTitle } from "@/lib/formatTitle";

const SearchResult: React.FC<SearchBarProps> = ({ searchResults, clearSearch }): JSX.Element => {

  return (
    <div className={styles.search_result}>
      {searchResults.length > 0 ? (
        searchResults.map((result, index) => (
          <Link
            href={`/problems/${formatTitle(result.title)}`}
            key={index}
            className={styles.result_item}
            onClick={clearSearch}
          >
            <p>{result.title}</p>
          </Link>
        ))
      ) : (
        <p className={styles.result_item}>No results found</p>
      )}
    </div>
  );
};

export default SearchResult;
