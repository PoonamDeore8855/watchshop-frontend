import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { StoreProvider } from "./Components/Store.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";

// Config axios to use live backend URL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090';

ReactDOM.createRoot(document.getElementById("root")).render(
  <StoreProvider>
    <GoogleOAuthProvider clientId="1037657084396-soc5ko8sdpkj0u8ec8ssgtaserdkvc31.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StoreProvider>
);
