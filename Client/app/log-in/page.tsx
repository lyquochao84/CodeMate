"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { LogInTypes } from "@/types/types_interface";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import styles from "./log-in.module.css";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { MdOutlinePassword } from "react-icons/md";
import { FaCheckCircle, FaGithub } from "react-icons/fa";

const LogIn: React.FC = (): JSX.Element => {
  const [userInfos, setUserInfos] = useState<LogInTypes>({
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [invalidMessage, setInvalidMessage] = useState<string>("");
  const router: AppRouterInstance = useRouter();
  const { isLoggedIn, logIn, loading } = useAuth(); // Get logIn from context

  // Submit Log In
  const loginSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      const response: Response = await fetch(
        "http://localhost:5000/auth/log-in",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfos),
          credentials: "include", // Ensures the cookie is set in the browser
        }
      );

      const result: { message: string } = await response.json();

      // If user enter wrong email or password
      if (
        response.status === 404 &&
        result.message === "Invalid credentials!"
      ) {
        setInvalidMessage("Please check again your email or password");
      }

      // If user not found
      if (response.status === 404 && result.message === "User not found!") {
        setInvalidMessage("Log in failed! User not found");
        setUserInfos({ email: "", password: "" });
      }

      if (!response.ok) {
        throw new Error("Log In Falied!");
      } else {
        setSuccessMessage("Log in successful!");
        setUserInfos({ email: "", password: "" });
        logIn();
        router.replace("/dashboard");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Error handling
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) router.push("/dashboard");
  }, [isLoggedIn, router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.register_content}>
      <div className={styles.register_modal}>
        <div className={styles.register_background}>
          <h2 className={styles.register_slogan_1}>Code Together</h2>
          <h2 className={styles.register_slogan_2}>Build Smarter</h2>
        </div>
        <div className={styles.register_part}>
          {successMessage ? (
            <div className={styles.registered_successfully_wrapper}>
              <p className={styles.registered_successfully}>
                Log In Successfully
              </p>
              <FaCheckCircle className={styles.registered_successfully_icon} />
            </div>
          ) : (
            <>
              <h3 className={styles.register_header}>Log In</h3>
              {invalidMessage && (
                <p className={styles.invalid_message}>{invalidMessage}</p>
              )}
              <form className={styles.register_form} onSubmit={loginSubmit}>
                <div className={styles.register_infos}>
                  {/* Email */}
                  <div className={styles.register_input_group}>
                    <label htmlFor="email">
                      <MdOutlineAlternateEmail />
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      required
                      value={userInfos.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setUserInfos({ ...userInfos, email: e.target.value });
                      }}
                    />
                  </div>
                  {/* Password */}
                  <div className={styles.register_input_group}>
                    <label htmlFor="password">
                      <MdOutlinePassword />
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      required
                      value={userInfos.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setUserInfos({
                          ...userInfos,
                          password: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className={styles.register_btn_wrapper}>
                    <button className={styles.register_btn}>Log In</button>
                  </div>
                  <div className={styles.or_txt_wrapper}>
                    <p className={styles.or_txt}>or Log In with</p>
                  </div>
                  <div className={styles.sign_in_options}>
                    <Link
                      href="http://localhost:5000/auth/github"
                      className={styles.sign_in_github_btn}
                    >
                      <FaGithub className={styles.sign_in_github} />
                    </Link>
                  </div>
                </div>
              </form>
              <Link href="/register" className={styles.register_text}>
                Don't have an account yet?
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogIn;
