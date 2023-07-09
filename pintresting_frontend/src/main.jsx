import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

document.body.classList.add('bg-slate-100');
document.body.classList.add('overfloy-y-auto');


ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider
  clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
  >
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
