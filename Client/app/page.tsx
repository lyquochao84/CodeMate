"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { useEffect } from "react";
import Link from "next/link";

import styles from "./page.module.css";

const Home: React.FC = (): JSX.Element => {
  const { isLoggedIn, loading } = useAuth();
  const router: AppRouterInstance = useRouter();

  useEffect(() => {
    if (isLoggedIn) router.push('/dashboard');
  }, [isLoggedIn, router]);
  
  if (loading) return <p>Loading...</p>

  return (
    <div className={styles.homepage_content}>
      <div className={styles.homepage_introduction}>
        <h1 className={styles.homepage_introduction_header}>Welcome To CodeMate</h1>
        <p className={styles.homepage_introduction_sub_header}>A Collaborative Coding Platform</p>
        <div className={styles.homepage_link_btn}>
          <Link href="/log-in" className={styles.homepage_link_btn_1}>Get Started</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;