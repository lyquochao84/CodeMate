import React from "react";
import styles from "./about.module.css";

const About: React.FC = (): JSX.Element => {
  return (
    <div className={styles.about}>
      <div className={styles.about_content}>
        <p>
          This project was developed by Kevin Ly as part of senior capstone course,
          CPSC 491, at California State University, Fullerton.
        </p>
      </div>
    </div>
  );
};

export default About;
