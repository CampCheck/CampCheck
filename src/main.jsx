import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";
import "./styles/Layout.css";

import "./styles/buttons.css";
import "./styles/cards.css";
import "./styles/checklist.css";
import "./styles/dashboard.css";
import "./styles/dialog.css";

import "./styles/Trips.css";
import "./styles/Caravan.css";
import "./styles/Weather.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);