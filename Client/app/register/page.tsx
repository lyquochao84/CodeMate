"use client";
import React from "react";
import { useState } from "react";

import styles from "./register.module.css";

import SuccessMessage from "@/components/register-form/success-message/SuccessMessage";
import RegisterForm from "@/components/register-form/RegisterForm";

const Register: React.FC = (): JSX.Element => {
  const [successMessage, setSuccessMessage] = useState<string>("");

  return (
    <div className={styles.register_content}>
      <div className={styles.register_modal}>
        <div className={styles.register_background}>
          <h2 className={styles.register_slogan_1}>Team Up</h2>
          <h2 className={styles.register_slogan_2}>Solve Faster</h2>
        </div>
        <div className={styles.register_part}>
          {/* Success message */}
          {successMessage ? (
            <SuccessMessage message={successMessage} />
          ) : (
            <RegisterForm setSuccessMessage={setSuccessMessage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
