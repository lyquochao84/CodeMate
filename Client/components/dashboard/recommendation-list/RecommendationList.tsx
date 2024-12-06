import React, { useState, useEffect } from "react";
import styles from "./recommendationList.module.css";
import Link from "next/link";
import Image from "next/image";
import { RecommendationListsTypes } from "@/types/interfaces";
import { useAuth } from "@/hooks/useAuth";

const RecommendationList: React.FC = (): JSX.Element => {
  const [recommendationLists, setRecommendationLists] = useState<
    RecommendationListsTypes[]
  >([]);
  const { loading } = useAuth();

  // Fetch Recommendation List
  useEffect(() => {
    const fetchData = async () => {
        try {
          // Fetch Recommendation Lists
          const recommendationsResponse: Response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_PRODUCTION}/data/recommendation-list`
          );
          const recommendationsData = await recommendationsResponse.json();
          setRecommendationLists(recommendationsData);
        } 
        catch (error: unknown) {
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
    <div className={styles.dashboard_item}>
      <h2 className={styles.dashboard_item_header}>Grinding Goals</h2>
      <div className={styles.dashboard_recommendation_list_item_wrapper}>
        {recommendationLists.length > 0 &&
          recommendationLists.map((item, index) => {
            // Convert the item name to lowercase and replace spaces with dashes
            const formattedList = item.list.toLowerCase().replace(/\s+/g, "-");

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
  );
};

export default RecommendationList;
