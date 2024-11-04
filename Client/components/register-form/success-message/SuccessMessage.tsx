import React from "react";
import styles from "./successMessage.module.css";
import { FaCheckCircle } from "react-icons/fa";

const SuccessMessage: React.FC<{ message: string }> = ({ message }): JSX.Element => (
  <div className={styles.registered_successfully_wrapper}>
    <p className={styles.registered_successfully}>{message}</p>
    <FaCheckCircle className={styles.registered_successfully_icon} />
    <p className={styles.redirect_login}>
      {Array.from("Redirecting to the Log In page...").map((char, index) => (
        <span key={index}>{char}</span>
      ))}
    </p>
  </div>
);

export default SuccessMessage;
