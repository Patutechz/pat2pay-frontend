import { createContext, useReducer, type ReactNode } from "react";
import type { CardDto } from "../types";

interface CardState {
  cards: CardDto[] | null;
}
type CardAction =
  | { type: "SET_CARDS"; payload: CardDto[] }
  | { type: "ADD_CARD"; payload: CardDto }
  | { type: "UPDATE_CARD"; payload: CardDto }
  | { type: "CLEAR_CARDS" };
interface CardContextType extends CardState {
  dispatch: React.Dispatch<CardAction>;
}

export const cardReducer = (
  state: CardState,
  action: CardAction,
): CardState => {
  switch (action.type) {
    case "SET_CARDS":
      return { cards: action.payload };
    case "ADD_CARD":
      return { cards: [...(state.cards ?? []), action.payload] };
    case "UPDATE_CARD":
      return {
        cards: (state.cards ?? []).map((c) =>
          c.id === action.payload.id ? action.payload : c,
        ),
      };
    case "CLEAR_CARDS":
      return { cards: null };
    default:
      return state;
  }
};

export const CardContext = createContext<CardContextType | null>(null);
export const CardContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cardReducer, { cards: null });
  return (
    <CardContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CardContext.Provider>
  );
};
