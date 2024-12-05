import React from "react";
import Image from "next/image";
import styles from "./ongoingProblems.module.css";
import congrat_logo from "@/public/img/applause.png";

const OngoingProblems: React.FC = (): JSX.Element => {
  return (
    <div className={styles.dashboard_item}>
      <h2 className={styles.dashboard_item_header}>Welcome to CodeMate</h2>
      <div className={styles.dashboard_item_ongoing_content}>
        <Image src={congrat_logo} width={60} height={60} alt="berkahicon" />
        <p className={styles.dashboard_item_text}>
          A playground for all programmers
        </p>
      </div>
    </div>
  );
};

export default OngoingProblems;
