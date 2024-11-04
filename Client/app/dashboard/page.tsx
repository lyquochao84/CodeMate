"use client";
import React from "react";
import styles from "./dashboard.module.css";

import OngoingProblems from "@/components/dashboard/ongoing-problems/OngoingProblems";
import RecommendationList from "@/components/dashboard/recommendation-list/RecommendationList";
import TopicsList from "@/components/dashboard/topics-list/TopicsList";

const DashBoard: React.FC = (): JSX.Element => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboard_content}>
        {/* Ongoing Problem(s) */}
        <OngoingProblems />
        {/* Grinding Goals */}
        <RecommendationList />
        {/* Topics */}
        <TopicsList />
      </div>
    </div>
  );
};

export default DashBoard;
