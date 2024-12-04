import React from "react";
import styles from "./loadingScreen.module.css"; 

const LoadingScreen: React.FC = (): JSX.Element => {
  return (
    <div className={styles.loading_screen}></div>
  );
};

export default LoadingScreen;
