import { AuthContext } from "@/contexts/authContext";
import { AuthContextTypes } from "@/types/types_interface";
import { useContext } from "react";

export const useAuth = (): AuthContextTypes => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
