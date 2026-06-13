import { useContext } from "react";
import { InvestmentContext } from "../context/InvestmentContext";
export const useInvestmentContext = () => {
  const ctx = useContext(InvestmentContext);
  if (!ctx)
    throw new Error(
      "useInvestmentContext must be used inside InvestmentContextProvider",
    );
  return ctx;
};
