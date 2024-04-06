import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import "./demos/ipc";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { Router } from "./routes";
import { ThemeProvider } from "./providers/theme-provider";
import { Toaster } from "./components/ui/toaster";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={Router} />

      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
