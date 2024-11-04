import React, { useEffect, useState } from "react";
import styles from "./loginForm.module.css";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { LogInTypes } from "@/types/interfaces";
import { useAuth } from "@/hooks/useAuth";
import { MdOutlineAlternateEmail, MdOutlinePassword } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { RegisterFormProps } from "@/types/type";
import InputForm from "../form-input/InputForm";

const LogInForm: React.FC<RegisterFormProps> = ({
  setSuccessMessage,
}): JSX.Element => {
  const [userInfos, setUserInfos] = useState<LogInTypes>({
    email: "",
    password: "",
  });
  const [invalidMessage, setInvalidMessage] = useState<string>("");
  const router: AppRouterInstance = useRouter();
  const { isLoggedIn, logIn, loading } = useAuth();

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
        setSuccessMessage("Log In Successfully");
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
    <>
      <h3 className={styles.register_header}>Log In</h3>
      {invalidMessage && (
        <p className={styles.invalid_message}>{invalidMessage}</p>
      )}
      <form className={styles.register_form} onSubmit={loginSubmit}>
        <div className={styles.register_infos}>
          {/* Email */}
          <InputForm
            label={<MdOutlineAlternateEmail />}
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={userInfos.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUserInfos({ ...userInfos, email: e.target.value });
            }}
          />
          {/* Password */}
          <InputForm
            label={<MdOutlinePassword />}
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={userInfos.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUserInfos({
                ...userInfos,
                password: e.target.value,
              });
            }}
          />
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
        Don&apos;t have an account yet?
      </Link>
    </>
  );
};

export default LogInForm;
