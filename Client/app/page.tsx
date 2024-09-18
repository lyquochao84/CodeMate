import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.homepage_content}>
      <div className={styles.homepage_introduction}>
        <h1 className={styles.homepage_introduction_header}>Welcome To CodeMate</h1>
        <p className={styles.homepage_introduction_sub_header}>A Collaborative Coding Platform</p>
        <div className={styles.homepage_link_btn}>
          <Link href="/" className={styles.homepage_link_btn_1}>Get Started</Link>
        </div>
      </div>
    </div>
  );
}
