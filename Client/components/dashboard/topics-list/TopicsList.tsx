import React, { useState, useEffect } from "react";
import styles from "./topicsList.module.css";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { GeneralListsTypes } from "@/types/interfaces";

const TopicsList: React.FC = (): JSX.Element => {
  const [generalLists, setGeneralLists] = useState<GeneralListsTypes[]>([]);
  const { loading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch General Lists
        const generalResponse: Response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PRODUCTION}/data/general-list`
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
    <div className={styles.dashboard_item}>
      <h2 className={styles.dashboard_item_header_topics}>Topics</h2>
      <div className={styles.dashboard_topics_list}>
        {generalLists.length > 0 &&
          generalLists.map((item, index) => {
            const formattedList = item.list.toLowerCase().replace(/\s+/g, "-");

            return (
              <Link
                key={index}
                href={`/${formattedList}`}
                className={styles.dashboard_topic_link}
              >
                <div key={index} className={styles.dashboard_topic_item}>
                  <Image src={item.image} alt="." width={60} height={60} />
                  <h4>{item.list}</h4>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default TopicsList;
