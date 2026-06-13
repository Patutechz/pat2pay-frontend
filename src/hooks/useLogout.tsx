import { useAuthContext } from "./useAuthContext";
import { useWalletContext } from "./useWalletContext";
import { useInvestmentContext } from "./useInvestmentContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: walletDispatch } = useWalletContext();
  const { dispatch: investDispatch } = useInvestmentContext();

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    walletDispatch({ type: "CLEAR_WALLET" });
    investDispatch({ type: "CLEAR_INVESTMENTS" });
  };
  return { logout };
};
