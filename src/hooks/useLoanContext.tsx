import { useContext } from "react";
import { LoanContext } from "../context/LoanContext";
export const useLoanContext = () => {
  const ctx = useContext(LoanContext);
  if (!ctx)
    throw new Error("useLoanContext must be used inside LoanContextProvider");
  return ctx;
};
