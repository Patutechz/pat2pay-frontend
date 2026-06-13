import { createContext, useReducer, type ReactNode } from "react";
import type { InvestmentDto } from "../types";

interface InvestmentState {
  investments: InvestmentDto[] | null;
}
type InvestmentAction =
  | { type: "SET_INVESTMENTS"; payload: InvestmentDto[] }
  | { type: "ADD_INVESTMENT"; payload: InvestmentDto }
  | { type: "CLEAR_INVESTMENTS" };
interface InvestmentContextType extends InvestmentState {
  dispatch: React.Dispatch<InvestmentAction>;
}

export const investmentReducer = (
  state: InvestmentState,
  action: InvestmentAction,
): InvestmentState => {
  switch (action.type) {
    case "SET_INVESTMENTS":
      return { investments: action.payload };
    case "ADD_INVESTMENT":
      return { investments: [action.payload, ...(state.investments ?? [])] };
    case "CLEAR_INVESTMENTS":
      return { investments: null };
    default:
      return state;
  }
};

export const InvestmentContext = createContext<InvestmentContextType | null>(
  null,
);
export const InvestmentContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(investmentReducer, {
    investments: null,
  });
  return (
    <InvestmentContext.Provider value={{ ...state, dispatch }}>
      {children}
    </InvestmentContext.Provider>
  );
};
