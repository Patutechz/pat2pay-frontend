import { createContext, useReducer, useEffect, type ReactNode } from "react";
import type { NewUserDto } from "../types";

interface AuthState {
  user: NewUserDto | null;
}
type AuthAction =
  | { type: "LOGIN"; payload: NewUserDto }
  | { type: "LOGOUT" }
  | { type: "UPDATE_BALANCE"; payload: number };

interface AuthContextType extends AuthState {
  dispatch: React.Dispatch<AuthAction>;
}

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    case "UPDATE_BALANCE":
      if (!state.user) return state;
      return { user: { ...state.user, walletBalance: action.payload } };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) dispatch({ type: "LOGIN", payload: JSON.parse(raw) });
  }, []);
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
