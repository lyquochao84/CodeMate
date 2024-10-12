"use client";
import { AuthContextTypes } from "@/types/types_interface";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext<AuthContextTypes | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <AuthContext.Provider value={{ loading, isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
