"use client";
import React, { Fragment } from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegisterTypes } from "@/types/types_interface";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import styles from "./register.module.css";
import { MdOutlineEmail } from "react-icons/md";
import { VscSymbolNamespace } from "react-icons/vsc";
import { PiPasswordDuotone } from "react-icons/pi";
import { PiPasswordFill } from "react-icons/pi";
import { FaCheckCircle } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";

const Register: React.FC = (): JSX.Element => {
  const [userData, setUserData] = useState<RegisterTypes>({
    email: "",
    password: "",
    nickname: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isDuplicateEmail, setIsDuplicateEmail] = useState<boolean>(false);
  const router: AppRouterInstance = useRouter();
  const { isLoggedIn, loading } = useAuth();

  // Submit Register Form
  const registerSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      const response: Response = await fetch(
        "http://localhost:5000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const result: { message: string } = await response.json();

      // Check if the email is already exists, and notify message to user
      if (
        response.status === 400 &&
        result.message === "Email already exists!"
      ) {
        setIsDuplicateEmail(true);
        // Reset form inputs
        setUserData({ email: "", password: "", nickname: "" });
        setConfirmPassword("");
        return; // Stop further execution
      }

      if (!response.ok) {
        throw new Error("Registration failed!");
      }

      // Reset form inputs and show success message
      setUserData({ email: "", password: "", nickname: "" });
      setConfirmPassword("");
      setSuccessMessage("Registration successful!");
      setTimeout(() => {
        router.push("/log-in");
      }, 1000);
    } catch (error: unknown) {
      // Error handling
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  // Check if password is match with confirm password
  const validatePassword: boolean =
    userData.password !== confirmPassword ? false : true;

  useEffect(() => {
    if (isLoggedIn) router.push("/dashboard");
  }, [isLoggedIn, router]);

  if (loading) return <p>Loading...</p>;

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
            <div className={styles.registered_successfully_wrapper}>
              <p className={styles.registered_successfully}>
                Registered Successfully
              </p>
              <FaCheckCircle className={styles.registered_successfully_icon} />
              <p className={styles.redirect_login}>
                {Array.from("Redirecting to the Log In page...").map(
                  (char, index) => (
                    <span key={index}>{char}</span>
                  )
                )}
              </p>
            </div>
          ) : (
            <form className={styles.register_form} onSubmit={registerSubmit}>
              <h3 className={styles.register_header}>Register</h3>
              <div className={styles.register_infos}>
                {/* Email */}
                <div className={styles.register_input_group}>
                  <label htmlFor="email">
                    <MdOutlineEmail />
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={userData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUserData({ ...userData, email: e.target.value });
                    }}
                  />
                </div>
                {isDuplicateEmail ? (
                  <p className={styles.duplicate_email}>
                    Email already exists. Please use a different email.
                  </p>
                ) : (
                  <Fragment></Fragment>
                )}
                {/* Nickname */}
                <div className={styles.register_input_group}>
                  <label htmlFor="nickname">
                    <VscSymbolNamespace />
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    placeholder="Nickname"
                    required
                    value={userData.nickname}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUserData({ ...userData, nickname: e.target.value });
                    }}
                  />
                </div>
                {/* Password */}
                <div className={styles.register_input_group}>
                  <label htmlFor="password">
                    <PiPasswordDuotone />
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    data-testid="password"
                    placeholder="Password"
                    required
                    value={userData.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUserData({ ...userData, password: e.target.value });
                    }}
                  />
                </div>
                {/* Confirm Password */}
                <div className={styles.register_input_group}>
                  <label htmlFor="confirmPassword">
                    <PiPasswordFill />
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    data-testid="confirmPassword"
                    placeholder="Confirm your password"
                    required
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                </div>
                {!validatePassword && (
                  <p className={styles.validate_password}>
                    Passwords do not match
                  </p>
                )}
                <div className={styles.register_btn_wrapper}>
                  <button className={styles.register_btn}>
                    Start Coding Now
                  </button>
                </div>
                <div className={styles.already_account}>
                  <p>Already have an account?</p>
                  <Link href="/log-in" className={styles.sign_in_text}>
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
