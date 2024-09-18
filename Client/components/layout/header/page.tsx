"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "./header.module.css";
import logo from "@/public/img/Logo.png";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.header_logo_link}>
        <Image src={logo} alt="CodeMate Logo" className={styles.logo} />
      </Link>
      <div className={styles.header_register}>
        <Link href="/log-in" className={styles.header_log_in}>
          Log In
        </Link>
        <Link href="/sign-up" className={styles.header_sign_up}>
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Header;
