"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import {
  GeneralListsTypes,
  RecommendationListsTypes,
} from "@/types/types_interface";

import styles from "./dashboard.module.css";
import congrat_logo from "@/public/img/applause.png";

const DashBoard: React.FC = (): JSX.Element => {
  const [recommendationLists, setRecommendationLists] = useState<
    RecommendationListsTypes[]
  >([]);
  const [generalLists, setGeneralLists] = useState<GeneralListsTypes[]>([]);
  const { loading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Recommendation Lists
        const recommendationsResponse: Response = await fetch(
          "http://localhost:5000/data/recommendation-list"
        );
        const recommendationsData = await recommendationsResponse.json();
        setRecommendationLists(recommendationsData);

        // Fetch General Lists
        const generalResponse: Response = await fetch(
          "http://localhost:5000/data/general-list"
        );
        const generalData = await generalResponse.json();
        setGeneralLists(generalData);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };

    fetchData();
  }, []);

  // Loading State
  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboard_content}>
        <div className={styles.dashboard_item}>
          <h2 className={styles.dashboard_item_header}>Ongoing Problem(s)</h2>
          <div className={styles.dashboard_item_ongoing_content}>
            <Image src={congrat_logo} width={60} height={60} alt="berkahicon" />
            <p className={styles.dashboard_item_text}>
              Well done! You have no remaining problems
            </p>
          </div>
        </div>
        <div className={styles.dashboard_item}>
          <h2 className={styles.dashboard_item_header}>Grinding Goals</h2>
          <div className={styles.dashboard_item_lists}>
            <div className={styles.dashboard_recommendation_list_item}>
              {/* Image */}
              {/* Data details */}
              {recommendationLists.map((item) => (
                <>
                  <h4>{item.list}</h4>
                  <p>{item.description}</p>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
