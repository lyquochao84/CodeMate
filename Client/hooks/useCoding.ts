import { CodingContext } from "@/contexts/codingContext";
import { CodingContextProps } from "@/types/interfaces";
import { useContext } from "react";

export const useCoding = (): CodingContextProps => {
  const context = useContext(CodingContext);
  if (!context) {
    throw new Error("useCoding must be used within a CodingProvider");
  }
  return context;
};
