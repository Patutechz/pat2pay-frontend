import { useContext } from "react";
import { CardContext } from "../context/CardContext";
export const useCardContext = () => {
  const ctx = useContext(CardContext);
  if (!ctx)
    throw new Error("useCardContext must be used inside CardContextProvider");
  return ctx;
};
