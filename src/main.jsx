import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { StoreProvider } from "./Components/Store.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StoreProvider>
    <GoogleOAuthProvider clientId="1037657084396-soc5ko8sdpkj0u8ec8ssgtaserdkvc31.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StoreProvider>
);
