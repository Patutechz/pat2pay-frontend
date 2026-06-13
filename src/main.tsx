import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthContextProvider } from "./context/AuthContext";
import { WalletContextProvider } from "./context/WalletContext";
import { InvestmentContextProvider } from "./context/InvestmentContext";
import { LoanContextProvider } from "./context/LoanContext";
import { CardContextProvider } from "./context/CardContext";
import { ThemeProviderWrapper } from "./ThemeContext";
import "./assets/css/fontawesome/css/all.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProviderWrapper>
      <AuthContextProvider>
        <WalletContextProvider>
          <InvestmentContextProvider>
            <LoanContextProvider>
              <CardContextProvider>
                <App />
              </CardContextProvider>
            </LoanContextProvider>
          </InvestmentContextProvider>
        </WalletContextProvider>
      </AuthContextProvider>
    </ThemeProviderWrapper>
  </StrictMode>,
);
