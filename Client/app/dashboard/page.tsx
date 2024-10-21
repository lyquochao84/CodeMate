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
import Link from "next/link";

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
        {/* Ongoing Problem(s) */}
        <div className={styles.dashboard_item}>
          <h2 className={styles.dashboard_item_header}>Ongoing Problem(s)</h2>
          <div className={styles.dashboard_item_ongoing_content}>
            <Image src={congrat_logo} width={60} height={60} alt="berkahicon" />
            <p className={styles.dashboard_item_text}>
              Well done! You have no remaining problems
            </p>
          </div>
        </div>
        {/* Grinding Goals */}
        <div className={styles.dashboard_item}>
          <h2 className={styles.dashboard_item_header}>Grinding Goals</h2>
          <div className={styles.dashboard_recommendation_list_item_wrapper}>
            {recommendationLists.length > 0 &&
              recommendationLists.map((item, index) => {
                // Convert the item name to lowercase and replace spaces with dashes
                const formattedList = item.list
                  .toLowerCase()
                  .replace(/\s+/g, "-");

                return (
                  <Link
                    href={`/${formattedList}`}
                    className={styles.recommendation_list_item_link}
                    key={index}
                  >
                    <div className={styles.recommendation_list_item}>
                      <Image src={item.image} alt="." width={50} height={50} />
                      <h4>{item.list}</h4>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
        {/* Topics */}
        <div className={styles.dashboard_item}>
          <h2 className={styles.dashboard_item_header_topics}>Topics</h2>
          <div className={styles.dashboard_topics_list}>
            {generalLists.length > 0 &&
              generalLists.map((item, index) => (
                <Link href="/" className={styles.dashboard_topic_link}>
                  <div key={index} className={styles.dashboard_topic_item}>
                    <Image src={item.image} alt="." width={60} height={60} />
                    <h4>{item.name}</h4>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
