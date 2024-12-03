"use client";
import { CodingContextProps } from "@/types/interfaces";
import React, { createContext, useState, ReactNode } from "react";

export const CodingContext = createContext<CodingContextProps | undefined>(
  undefined
);

export const CodingProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>(() => "");
  const [code, setCode] = useState<string>(() => "");

  return (
    <CodingContext.Provider value={{ language, setLanguage, code, setCode }}>
      {children}
    </CodingContext.Provider>
  );
};
