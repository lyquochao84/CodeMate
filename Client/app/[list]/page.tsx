"use client";
import React, { useState, useEffect } from "react";
import { ProblemsTypes } from "@/types/types_interface";

import styles from "./recommendation-list.module.css";

export default function RecommendationListPage({ params }: { params: { list: string } }) {
  const [recommendationProblems, setRecommendationProblems] = useState<ProblemsTypes[]>([]);

  // Fetch problems from back-end
  useEffect(() => {
    const fetchRecommendationListProblems = async () => {
      try {
        const response: Response = await fetch("http://localhost:5000/data/problems");
        const data = await response.json();
        setRecommendationProblems(data);
      }
      catch(error: unknown) {
        if (error instanceof Error) {
            console.error(error);
        }
      }     
    }

    fetchRecommendationListProblems();
  }, []);
  
    return <div>My Post: {params.list}</div>;
}

