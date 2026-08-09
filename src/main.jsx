import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import App from "./App";
import "./styles/global.css";
import "./styles/Layout.css";
import { ThemeProvider } from "./theme/ThemeProvider";

import "./styles/buttons.css";
import "./styles/cards.css";
import "./styles/checklist.css";
import "./styles/dashboard.css";
import "./styles/dialog.css";

import "./styles/Trips.css";
import "./styles/Caravan.css";
import "./styles/Weather.css";
import { AuthProvider } from "./auth/AuthProvider";
import { GroupProvider } from "./auth/GroupProvider";

registerSW({
  immediate: true,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
  <GroupProvider>
    <ThemeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </GroupProvider>
</AuthProvider>
);