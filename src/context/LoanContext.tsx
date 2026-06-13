import { createContext, useReducer, type ReactNode } from "react";
import type { LoanDto } from "../types";

interface LoanState {
  loans: LoanDto[] | null;
}
type LoanAction =
  | { type: "SET_LOANS"; payload: LoanDto[] }
  | { type: "ADD_LOAN"; payload: LoanDto }
  | { type: "UPDATE_LOAN"; payload: LoanDto }
  | { type: "CLEAR_LOANS" };
interface LoanContextType extends LoanState {
  dispatch: React.Dispatch<LoanAction>;
}

export const loanReducer = (
  state: LoanState,
  action: LoanAction,
): LoanState => {
  switch (action.type) {
    case "SET_LOANS":
      return { loans: action.payload };
    case "ADD_LOAN":
      return { loans: [action.payload, ...(state.loans ?? [])] };
    case "UPDATE_LOAN":
      return {
        loans: (state.loans ?? []).map((l) =>
          l.id === action.payload.id ? action.payload : l,
        ),
      };
    case "CLEAR_LOANS":
      return { loans: null };
    default:
      return state;
  }
};

export const LoanContext = createContext<LoanContextType | null>(null);
export const LoanContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(loanReducer, { loans: null });
  return (
    <LoanContext.Provider value={{ ...state, dispatch }}>
      {children}
    </LoanContext.Provider>
  );
};
