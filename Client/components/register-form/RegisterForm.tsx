import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegisterTypes } from "@/types/interfaces";
import { useAuth } from "@/hooks/useAuth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import InputForm from "../form-input/InputForm";
import { RegisterFormProps } from "@/types/type";

import styles from "./registerForm.module.css";
import { MdOutlineEmail } from "react-icons/md";
import { VscSymbolNamespace } from "react-icons/vsc";
import { PiPasswordDuotone } from "react-icons/pi";
import { PiPasswordFill } from "react-icons/pi";

const RegisterForm: React.FC<RegisterFormProps> = ({ setSuccessMessage }): JSX.Element => {
  const [userData, setUserData] = useState<RegisterTypes>({
    email: "",
    password: "",
    nickname: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
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
        `http://${process.env.SERVER_PRODUCTION}/auth/register`,
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
    <form className={styles.register_form} onSubmit={registerSubmit}>
      <h3 className={styles.register_header}>Register</h3>
      <div className={styles.register_infos}>
        {/* Email */}
        <InputForm
          label={<MdOutlineEmail />}
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        {isDuplicateEmail ? (
          <p className={styles.duplicate_email}>
            Email already exists. Please use a different email.
          </p>
        ) : (
          <></>
        )}
        {/* Nickname */}
        <InputForm
          label={<VscSymbolNamespace />}
          type="text"
          id="nickname"
          name="nickname"
          placeholder="Nickname"
          value={userData.nickname}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setUserData({ ...userData, nickname: e.target.value });
          }}
        />
        {/* Password */}
        <InputForm
          label={<PiPasswordDuotone />}
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
        />
        {/* Confirm Password */}
        <InputForm
          label={<PiPasswordFill />}
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {!validatePassword && (
          <p className={styles.validate_password}>Passwords do not match</p>
        )}
        <div className={styles.register_btn_wrapper}>
          <button className={styles.register_btn}>Start Coding Now</button>
        </div>
        <div className={styles.already_account}>
          <p>Already have an account?</p>
          <Link href="/log-in" className={styles.sign_in_text}>
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
