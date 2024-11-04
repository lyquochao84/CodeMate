"use client";
import React from "react";
import { useAuth } from "@/hooks/useAuth";

import styles from "../problems/problems.module.css";
import ListDetails from "@/components/list-details/ListDetails";

export default function RecommendationListPage({ params }: { params: { list: string }}) {
  const { loading } = useAuth();
  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.problems_pages}>
      <ListDetails params={params} />
    </div>
  );
}
