import React from "react";
import Link from "next/link";

import styles from "./register.module.css";
import { MdOutlineEmail } from "react-icons/md";
import { VscSymbolNamespace } from "react-icons/vsc";
import { PiPasswordDuotone } from "react-icons/pi";
import { PiPasswordFill } from "react-icons/pi";

const Register: React.FC = () => {
  return (
    <div className={styles.register_content}>
      <div className={styles.register_modal}>
        <div className={styles.register_background}>
          <h2 className={styles.register_slogan_1}>Team Up</h2>
          <h2 className={styles.register_slogan_2}>Solve Faster</h2>
        </div>
        <div className={styles.register_part}>
          <form className={styles.register_form}>
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
                />
              </div>
              {/* Nickname */}
              <div className={styles.register_input_group}>
                <label htmlFor="username">
                  <VscSymbolNamespace />
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Nickname"
                  required
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
                  placeholder="Password"
                  required
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
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <div className={styles.register_btn_wrapper}>
                <button className={styles.register_btn}>Start Coding Now</button>
              </div>
              {/* <p className={styles.or_txt}>OR</p> */}
              <div className={styles.already_account}>
                <p>Already have an account?</p>
                <Link href="/log-in" className={styles.sign_in_text}>Sign In</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
