"use client";
import React, { useState } from "react";

import styles from "./log-in.module.css";

import SuccessMessage from "@/components/login-form/success-message/SuccessMessage";
import LogInForm from "@/components/login-form/LogInForm";

const LogIn: React.FC = (): JSX.Element => {
  const [successMessage, setSuccessMessage] = useState<string>("");

  return (
    <div className={styles.register_content}>
      <div className={styles.register_modal}>
        <div className={styles.register_background}>
          <h2 className={styles.register_slogan_1}>Code Together</h2>
          <h2 className={styles.register_slogan_2}>Build Smarter</h2>
        </div>
        <div className={styles.register_part}>
          {successMessage ? (
            <SuccessMessage message={successMessage} />
          ) : (
            <LogInForm setSuccessMessage={setSuccessMessage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LogIn;
