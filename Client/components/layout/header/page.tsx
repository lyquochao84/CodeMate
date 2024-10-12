"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import Link from "next/link";

import listImg from "@/public/img/check-list.png";
import friendListImg from "@/public/img/followers.png";
import progressImg from "@/public/img/goal.png";
import settingImg from "@/public/img/settings.png";

import styles from "./header.module.css";
import logo from "@/public/img/Logo.png";
import { FaRegUserCircle } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null> (null);
  const iconRef = useRef<HTMLDivElement | null> (null);
  const router: AppRouterInstance = useRouter();
  const { isLoggedIn, logOut, loading } = useAuth();

  // Toggle modal open/close
  const toggleModal = (): void => {
    setIsModalOpen((prev) => !prev);
  };

  // Log Out Button
  const handleLogout = (): void => {
    logOut();
    router.push("/log-in");
  };

  // Handle clicks outside the modal to close it
  const handleClickOutside = (e: MouseEvent): void => {
    if (
      modalRef.current && 
      !modalRef.current.contains(e.target as Node) && 
      iconRef.current &&
      !iconRef.current.contains(e.target as Node)
    ) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    
    // Clean up the event listener when the component unmounts    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  if (loading) return <p>Loading...</p>;

  return (
    <header className={styles.header}>
      <div className={styles.header_features_logo_part}>
        <Link
          href={isLoggedIn ? "/dashboard" : "/"}
          className={styles.header_logo_link}
        >
          <Image src={logo} alt="CodeMate Logo" className={styles.logo} />
        </Link>
        {isLoggedIn && (
          // Features
          <>
            <div className={styles.header_features}>
              <Link
                href="/dashboard/problems"
                className={styles.header_navigation_link}
              >
                <p className={styles.header_navigation_item}>Problems</p>
              </Link>
              <Link
                href="/dashboard/leaderboard"
                className={styles.header_navigation_link}
              >
                <p className={styles.header_navigation_item}>Leaderboard</p>
              </Link>
              <Link
                href="/dashboard/about"
                className={styles.header_navigation_link}
              >
                <p className={styles.header_navigation_item}>About</p>
              </Link>
            </div>
            {/* Search bar */}
            <div className={styles.search_container}>
              <input
                type="text"
                placeholder="🔎 Search for friends..."
                className={styles.search_input}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
          </>
        )}
      </div>
      <div className={styles.header_register}>
        {isLoggedIn ? (
          <>
            <>
              <IoNotificationsOutline className={styles.header_notify_icon} />
              <div ref={iconRef}>
                <FaRegUserCircle
                  className={styles.header_user_infos_icon}
                  onClick={toggleModal}
                />
              </div>
            </>
            {isModalOpen && (
              <div className={styles.modal} ref={modalRef}>
                <div className={styles.modal_content}>
                  <h3 className={styles.modal_option_header}>Kevin</h3>
                  <div className={styles.modal_content_options}>
                    <div className={styles.modal_option}>
                      <Image
                        className={styles.modal_options_icon}
                        src={listImg}
                        alt="Freepik"
                        width={46}
                        height={46}
                      />
                      <p className={styles.modal_option_text}>Favorite</p>
                    </div>
                    <div className={styles.modal_option}>
                      <Image
                        className={styles.modal_options_icon}
                        src={friendListImg}
                        alt="Freepik"
                        width={46}
                        height={46}
                      />
                      <p className={styles.modal_option_text}>Friends</p>
                    </div>
                    <div className={styles.modal_option}>
                      <Image
                        className={styles.modal_options_icon}
                        src={progressImg}
                        alt="Freepik"
                        width={46}
                        height={46}
                      />
                      <p className={styles.modal_option_text}>Progress</p>
                    </div>
                    <div className={styles.modal_option}>
                      <Image
                        className={styles.modal_options_icon}
                        src={settingImg}
                        alt="Prosymbols"
                        width={46}
                        height={46}
                      />
                      <p className={styles.modal_option_text}>Settings</p>
                    </div>
                  </div>
                  <button
                    className={styles.sign_out_btn}
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <Link href="/log-in" className={styles.header_log_in}>
              Log In
            </Link>
            <Link href="/register" className={styles.header_sign_up}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
