import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { CurrencyProvider } from "./context/CurrencyContext.tsx";
import { LanguageProvider } from "./context/LanguageContext.tsx";
import "./index.css";   // ← AJOUTE CETTE LIGNE ICI

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LanguageProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </LanguageProvider>
  </React.StrictMode>
);
