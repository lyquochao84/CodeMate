import styles from "./footer.module.css";
import React from "react";

const Footer: React.FC = (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <h4>© 2024 CodeMate</h4>
    </footer>
  );
};

export default Footer;
