import React from "react";
import Link from "next/link";

import styles from "./log-in.module.css";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { MdOutlinePassword } from "react-icons/md";
import { FaGithub } from "react-icons/fa";

const LogIn: React.FC = () => {
  return (
    <div className={styles.register_content}>
      <div className={styles.register_modal}>
        <div className={styles.register_background}>
          <h2 className={styles.register_slogan_1}>Code Together</h2>
          <h2 className={styles.register_slogan_2}>Build Smarter</h2>
        </div>
        <div className={styles.register_part}>
          <form className={styles.register_form}>
            <h3 className={styles.register_header}>Log In</h3>
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
                />
              </div>
              <div className={styles.register_btn_wrapper}>
                <button className={styles.register_btn}>Log In</button>
              </div>
              <div className={styles.or_txt_wrapper}>
                <p className={styles.or_txt}>Or Log In With</p>
              </div>
              <div className={styles.sign_in_options}>
                <button className={styles.sign_in_github_btn}>
                  <FaGithub className={styles.sign_in_github} />
                </button>
              </div>
            </div>
          </form>
          {/*  */}
          <Link href="/register" className={styles.register_text}>Don't have an account yet?</Link>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
