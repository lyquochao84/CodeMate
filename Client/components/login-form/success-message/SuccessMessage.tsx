import React from "react";
import styles from "./successMessage.module.css";
import { FaCheckCircle } from "react-icons/fa";

const SuccessMessage: React.FC<{ message: string }> = ({
  message,
}): JSX.Element => (
  <div className={styles.registered_successfully_wrapper}>
    <p className={styles.registered_successfully}>{message}</p>
    <FaCheckCircle className={styles.registered_successfully_icon} />
  </div>
);

export default SuccessMessage;
