"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
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
import { IoMdCloseCircleOutline } from "react-icons/io";

const Header: React.FC = (): JSX.Element => {
  const [userNickname, setUserNickname] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isNotiModalOpen, setIsNotiModalOpen] = useState<boolean>(false);
  const [isJoinRoomOpen, setIsJoinRoomOpen] = useState<boolean>(false);
  const [isInRoom, setIsInRoom] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const notifyModalRef = useRef<HTMLDivElement | null>(null);
  const iconNotifyRef = useRef<HTMLDivElement | null>(null);
  const joinRoomRef = useRef<HTMLDivElement | null>(null);
  const router: AppRouterInstance = useRouter();
  const pathname = usePathname(); // Get the current route path
  const { isLoggedIn, logOut, loading } = useAuth();

  // Get user's nickname
  useEffect(() => {
    if (isLoggedIn) {
      const fetchUserName = async () => {
        try {
          const response: Response = await fetch(
            "http://localhost:5000/auth/user",
            {
              method: "GET",
              credentials: "include", // Include cookie
            }
          );

          const result = await response.json();

          if (response.ok) {
            setUserNickname(result.nickname);
          } else {
            console.error(`Error fetching user data: ${result.message}`);
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(`${error.message}`);
          }
        }
      };

      fetchUserName();
    }
  }, [isLoggedIn]);

  // Toggle modal open/close
  const toggleModal = (): void => {
    setIsModalOpen((prev) => !prev);
  };

  const toggleNotifyModal = (): void => {
    setIsNotiModalOpen((prev) => !prev);
  };

  const toggleJoinRoom = (): void => {
    setIsJoinRoomOpen((prev) => !prev);
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
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener when the component unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  // Handle clicks outside the notifcation modal to close it
  const handleNotifyClickOutside = (e: MouseEvent): void => {
    if (
      notifyModalRef.current &&
      !notifyModalRef.current.contains(e.target as Node) &&
      iconNotifyRef.current &&
      !iconNotifyRef.current.contains(e.target as Node)
    ) {
      setIsNotiModalOpen(false);
    }
  };

  useEffect(() => {
    if (isNotiModalOpen) {
      document.addEventListener("mousedown", handleNotifyClickOutside);
    } else {
      document.removeEventListener("mousedown", handleNotifyClickOutside);
    }

    // Clean up the event listener when the component unmounts
    return () =>
      document.removeEventListener("mousedown", handleNotifyClickOutside);
  }, [isNotiModalOpen]);

  // Handle mouse event that clicked outside of the join room modal
  const handleClickJoinRoomOutside = (e: MouseEvent): void => {
    if (
      joinRoomRef.current &&
      !joinRoomRef.current.contains(e.target as Node)
    ) {
      setIsJoinRoomOpen(false);
    }
  };

  useEffect(() => {
    if (isJoinRoomOpen) {
      document.addEventListener("mousedown", handleClickJoinRoomOutside);
    } else {
      document.removeEventListener("mousedown", handleClickJoinRoomOutside);
    }

    // Clean up the event listener when the component unmounts
    return () =>
      document.removeEventListener("mousedown", handleClickJoinRoomOutside);
  }, [isJoinRoomOpen]);

  // Check if user is in room or not
  useEffect(() => {
    // Check if the pathname includes a roomId
    const pathParts = pathname.split("/");
    const hasRoomId = pathParts[3]; 
    setIsInRoom(!!hasRoomId); 
  }, [pathname]);

  // Join Room Button
  const handleJoinRoom = (): void => {
    console.log("Join Room");
  };

  // Leave Room Button
  const handleLeaveRoom = (): void => {
    console.log("Leave room logic here");
    setIsInRoom(false);
    router.push(`/problems`);
  };

  // Loading until component mount
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
              <Link href="/problems" className={styles.header_navigation_link}>
                <p className={styles.header_navigation_item}>Problems</p>
              </Link>
              <Link href="/about" className={styles.header_navigation_link}>
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
              <button
                className={`${
                  isInRoom ? styles.leave_room_btn : styles.join_room_btn
                }`}
                onClick={isInRoom ? handleLeaveRoom : toggleJoinRoom}
              >
                {isInRoom ? "Leave Room" : "Join Room"}
              </button>
              <div className={styles.notification_wrapper}>
                <div ref={iconNotifyRef}>
                  <IoNotificationsOutline
                    className={styles.header_notify_icon}
                    onClick={toggleNotifyModal}
                  />
                </div>
                {isNotiModalOpen && (
                  <div
                    className={styles.notification_modal_wrapper}
                    ref={notifyModalRef}
                  >
                    <h3 className={styles.modal_option_header}>Notification</h3>
                    <div className={styles.notification_item_wrapper}>
                      <Link href="/" className={styles.notification_item_link}>
                        <div className={styles.notification_item_header}>
                          <p>Update A</p>
                          <p>October 14, 2024, 10:30 PM</p>
                        </div>
                      </Link>
                      <p className={styles.notification_item_content}>
                        Update ABCDFEJOWJDDW
                      </p>
                    </div>
                    <div className={styles.notification_item_wrapper}>
                      <div className={styles.notification_item_header}>
                        <p>Update B</p>
                        <p>October 14, 2024, 10:30 PM</p>
                      </div>
                      <p className={styles.notification_item_content}>
                        Update ABCDFEJOWJDDW
                      </p>
                    </div>
                    <div className={styles.notification_item_wrapper}>
                      <div className={styles.notification_item_header}>
                        <p>Update C</p>
                        <p>October 14, 2024, 10:30 PM</p>
                      </div>
                      <p className={styles.notification_item_content}>
                        Update ABCDFEJOWJDDW
                      </p>
                    </div>
                    <div className={styles.notification_item_wrapper}>
                      <div className={styles.notification_item_header}>
                        <p>Update D</p>
                        <p>October 14, 2024, 10:30 PM</p>
                      </div>
                      <p className={styles.notification_item_content}>
                        Update ABCDFEJOWJDDW
                      </p>
                    </div>
                  </div>
                )}
              </div>
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
                  <h3 className={styles.modal_option_header}>{userNickname}</h3>
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
            {isJoinRoomOpen && (
              <div className={styles.modal_overlay}>
                <div
                  className={styles.join_room_modal_content}
                  onClick={(e) => e.stopPropagation()}
                  ref={joinRoomRef}
                >
                  <IoMdCloseCircleOutline
                    className={styles.modal_close_btn}
                    onClick={toggleJoinRoom}
                  />
                  <div className={styles.create_room_content}>
                    <h3 className={styles.room_header}>Join Room</h3>
                    <form className={styles.room_form}>
                      <div className={styles.room_form_id_wrapper}>
                        <input
                          type="text"
                          id="room"
                          name="room"
                          placeholder="Enter Room ID"
                          value={""}
                          onChange={() => ""}
                        />
                      </div>
                    </form>
                    <button
                      className={styles.create_room_btn}
                      onClick={handleJoinRoom}
                    >
                      Join Room
                    </button>
                  </div>
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
