import { useContext } from "react";
import { WalletContext } from "../context/WalletContext";
export const useWalletContext = () => {
  const ctx = useContext(WalletContext);
  if (!ctx)
    throw new Error(
      "useWalletContext must be used inside WalletContextProvider",
    );
  return ctx;
};
