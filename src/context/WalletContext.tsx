import { createContext, useReducer, type ReactNode } from "react";
import type { WalletDto } from "../types";

interface WalletState {
  wallet: WalletDto | null;
}
type WalletAction =
  | { type: "SET_WALLET"; payload: WalletDto }
  | { type: "CLEAR_WALLET" };
interface WalletContextType extends WalletState {
  dispatch: React.Dispatch<WalletAction>;
}

export const walletReducer = (
  state: WalletState,
  action: WalletAction,
): WalletState => {
  switch (action.type) {
    case "SET_WALLET":
      return { wallet: action.payload };
    case "CLEAR_WALLET":
      return { wallet: null };
    default:
      return state;
  }
};

export const WalletContext = createContext<WalletContextType | null>(null);
export const WalletContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(walletReducer, { wallet: null });
  return (
    <WalletContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WalletContext.Provider>
  );
};
