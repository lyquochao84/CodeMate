"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import Link from "next/link";

import styles from "./header.module.css";
import logo from "@/public/img/Logo.png";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import socket from "@/config/socket_io";
import { toast, Toaster } from "react-hot-toast";
import SearchResult from "@/components/search-problems/SearchResult";

const Header: React.FC = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isNotiModalOpen, setIsNotiModalOpen] = useState<boolean>(false);
  const [isJoinRoomOpen, setIsJoinRoomOpen] = useState<boolean>(false);
  const [isInRoom, setIsInRoom] = useState<boolean>(false);
  const [inputRoomId, setInputRoomId] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<{ title: string }[]>([]);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const notifyModalRef = useRef<HTMLDivElement | null>(null);
  const iconNotifyRef = useRef<HTMLDivElement | null>(null);
  const joinRoomRef = useRef<HTMLDivElement | null>(null);
  const router: AppRouterInstance = useRouter();
  const pathname = usePathname(); // Get the current route path
  const params = useParams();
  const { roomId } = params;
  const { isLoggedIn, logOut, loading, username } = useAuth();

  // Toggle modal open/close
  const toggleModal = (): void => {
    setIsModalOpen((prev) => !prev);
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
  const handleJoinRoom = async (): Promise<void> => {
    if (!inputRoomId) {
      alert("Please enter Room ID");
      return;
    }

    try {
      const response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PRODUCTION}room/join-room`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId: inputRoomId }),
        }
      );

      const data = await response.json();
      const problemTitle = data.problemTitle;

      // If the room-id does not matches
      if (data.message === "This room does not exist!") {
        toast.error("This room does not exist!");
      }

      // If the room-id matches, redirect user to the existing room
      if (data.message === "Redirect the user to the existing room!") {
        router.push(`/problems/${problemTitle}/${inputRoomId}`);
        setIsJoinRoomOpen(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  };

  // Leave Room Button
  const handleLeaveRoom = (): void => {
    socket.emit("leave-room", { roomId });
    socket.disconnect();
    router.push("/problems");
  };

  // Handle search input
  const handleSearchInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(event.target.value);

    if (value.trim() === "") {
      // Clear results if input is empty
      setSearchResults([]); 
      return;
    }

    try {
      const response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PRODUCTION}data/search-problems?query=${encodeURIComponent(value)}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data); 
    } 
    catch (error: unknown) {
      if (error instanceof Error) {
       console.error('Error fetching search results', error); 
      }
    }
  };
 
  // Clear search input and search result after user clicked
  const clearSearch = (): void => {
    setSearchInput(""); 
    setSearchResults([]); 
  };

  // Loading until component mount
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.header_features_logo_part}>
          <Link
            href={isLoggedIn ? "/dashboard" : "/"}
            className={`${styles.header_logo_link} ${
              isInRoom ? styles.disabled : ""
            }`}
          >
            <Image src={logo} alt="CodeMate Logo" className={styles.logo} />
          </Link>
          {isLoggedIn && (
            // Features
            <>
              <div className={styles.header_features}>
                <Link
                  href="/problems"
                  className={`${styles.header_navigation_link} ${
                    isInRoom ? styles.disabled : ""
                  }`}
                >
                  <p className={styles.header_navigation_item}>Problems</p>
                </Link>
                <Link
                  href="/about"
                  className={`${styles.header_navigation_link} ${
                    isInRoom ? styles.disabled : ""
                  }`}
                >
                  <p className={styles.header_navigation_item}>About</p>
                </Link>
              </div>
              {/* Search bar */}
              <div className={styles.search_container}>
                <input
                  type="text"
                  placeholder="🔎 Search for problems..."
                  className={styles.search_input}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  value={searchInput}
                  onChange={handleSearchInput}
                />
                {searchInput && <SearchResult searchResults={searchResults} clearSearch={clearSearch}/>}
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
                <div ref={iconRef}>
                  <FaRegUserCircle
                    className={`${styles.header_user_infos_icon} ${
                      isInRoom ? styles.disabled : ""
                    }`}
                    onClick={toggleModal}
                  />
                </div>
              </>
              {isModalOpen && (
                <div className={styles.modal} ref={modalRef}>
                  <div className={styles.modal_content}>
                    <h3 className={styles.modal_option_header}>{username}</h3>
                    <div className={styles.modal_content_options}>
                      
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
                            value={inputRoomId}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setInputRoomId(e.target.value);
                            }}
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
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default Header;
