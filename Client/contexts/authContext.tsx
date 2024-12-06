"use client";
import { AuthContextTypes } from "@/types/interfaces";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext<AuthContextTypes | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUserName] = useState<string>("");

  useEffect(() => {
    const checkAuth = (): void => {
      const token = Cookies.get("token");

      if (token) {
        setIsLoggedIn(true);
      } 
      else {
        setIsLoggedIn(false);
      }

      setLoading(false);
    };

    // Call checkAuth when the component mounts
    checkAuth();

    // Also listen to any updates in cookies using window event listeners
    const handleCookieChange = (): void => {
      checkAuth();
    };

    window.addEventListener("focus", handleCookieChange);

    return () => {
      window.removeEventListener("focus", handleCookieChange);
    };
  }, []);

  const logIn = () => setIsLoggedIn(true);
  const logOut = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
  };

   // Get user's nickname
   useEffect(() => {
    if (isLoggedIn) {
      const fetchUserName = async () => {
        try {
          const response: Response = await fetch(
            `http://${process.env.SERVER_PRODUCTION}/auth/user`,
            {
              method: "GET",
              credentials: "include", // Include cookie
            }
          );

          const result = await response.json();

          if (response.ok) {
            setUserName(result.nickname);
          } 
          else {
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

  return (
    <AuthContext.Provider value={{ loading, isLoggedIn, logIn, logOut, username }}>
      {children}
    </AuthContext.Provider>
  );
};
