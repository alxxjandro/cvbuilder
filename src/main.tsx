import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { initSession } from "./lib/session";
import "./styles/theme.css";
import "./styles/print.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

// Wire the Supabase auth session into the stores before the first render
// (no-op when Supabase is not configured).
initSession();

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
