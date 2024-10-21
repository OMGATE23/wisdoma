import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthContextProvider } from "./context/UserContext.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <>
      <App />
      <Toaster />
      </>
    </AuthContextProvider>
  </StrictMode>
);
