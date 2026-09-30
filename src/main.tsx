import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/motion.css";
import "./styles/sections.css";
import "./styles/visuals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
