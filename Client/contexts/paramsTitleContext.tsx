"use client";

import React, { createContext, useState, ReactNode } from "react";
import { ProblemContextType } from "@/types/interfaces";

export const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

export const ProblemProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [problemTitle, setProblemTitle] = useState<string | null>(null);
  
  return (
    <ProblemContext.Provider value={{ problemTitle, setProblemTitle }}>
      {children}
    </ProblemContext.Provider>
  );
};
