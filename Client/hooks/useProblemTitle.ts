import { useContext } from "react";
import { ProblemContextType } from "@/types/interfaces";
import { ProblemContext } from "@/contexts/paramsTitleContext";

export const useProblemTitle = (): ProblemContextType => {
  const context = useContext(ProblemContext);
  if (!context) {
    throw new Error("useProblemTitle must be used within a ProblemProvider");
  }
  return context;
};
